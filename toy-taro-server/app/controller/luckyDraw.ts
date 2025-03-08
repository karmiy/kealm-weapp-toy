import { Controller } from "egg";
import { Logger } from "../utils/logger";
import { LuckyDrawEntity } from "../entity/luckyDraw";
import { LuckyDrawModel } from "../model/luckyDraw";
import {
  LUCKY_DRAW_TYPE,
  SERVER_CODE,
  FILE_SOURCE_TYPE,
  FILE_MODULE_NAME,
  FILE_NAME_PREFIX,
} from "../utils/constants";

const logger = Logger.getLogger("[LuckyDrawController]");

export default class LuckyDrawController extends Controller {
  private _luckyDrawModelToEntity(model: LuckyDrawModel): LuckyDrawEntity {
    const { ctx } = this;
    const entity: LuckyDrawEntity = ctx.helper.cleanEmptyFields(
      {
        id: model.id,
        type: model.type,
        cover_image: model.cover_image,
        name: model.name,
        quantity: model.quantity,
        list: model.list,
        create_time: model.create_time.getTime(),
        last_modified_time: model.last_modified_time.getTime(),
      },
      {
        ignoreList: [undefined, null],
      }
    );

    return entity;
  }

  public async getLuckyDrawList() {
    const { ctx } = this;
    try {
      const list = await ctx.service.luckyDraw.getLuckyDrawList();

      const luckyDrawList: LuckyDrawEntity[] = list.map((item) =>
        this._luckyDrawModelToEntity(item)
      );
      logger.tag("[getLuckyDrawList]").info("list", luckyDrawList);

      ctx.responseSuccess({
        data: luckyDrawList,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async updateLuckyDraw() {
    const { ctx, app } = this;
    const { userId, groupId } = ctx.getUserInfo();
    try {
      const params = ctx.getParams<{
        id?: string;
        name?: string;
        type?: LUCKY_DRAW_TYPE;
        list?: string;
        quantity?: string;
      }>();

      const { id, name, type, list, quantity } = params;
      const file = ctx.request.files?.[0];

      logger.tag("[updateLuckyDraw]").info(params);

      if (!id && !file) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿池封面图不能为空",
        });
        return;
      }

      if (!name) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿池名称不能为空",
        });
        return;
      }

      if (!type) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿池类型不能为空",
        });
        return;
      }

      if (!list) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖品列表不能为空",
        });
        return;
      }

      if (!quantity) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿次数不能为空",
        });
        return;
      }

      let parsedList: Array<{ prize_id: string; range: number }>;
      try {
        parsedList = Array.isArray(list) ? list : JSON.parse(list);
        if (!Array.isArray(parsedList)) {
          throw new Error("奖品列表必须是数组");
        }
      } catch (error) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "奖品列表格式错误",
        });
        return;
      }

      const fileData = file
        ? await app.uploadFile({
            file,
            sourceType: FILE_SOURCE_TYPE.IMAGES,
            moduleName: FILE_MODULE_NAME.LUCKY_DRAW,
            groupId,
            userId,
            fileNamePrefix: FILE_NAME_PREFIX.LUCKY_DRAW_COVER,
          })
        : null;

      const prevLuckyDrawModel = id
        ? await ctx.service.luckyDraw.findLuckyDraw({ id })
        : null;
      if (id && !prevLuckyDrawModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿池不存在",
        });
        return;
      }

      const oldCoverImage = prevLuckyDrawModel?.cover_image;
      const newCoverImage = fileData?.filename;

      const luckyDrawModel = await ctx.service.luckyDraw.upsertLuckyDraw({
        id,
        name,
        type,
        list: parsedList,
        quantity: Number(quantity),
        cover_image: newCoverImage,
        user_id: !id ? userId : undefined,
      });

      oldCoverImage &&
        newCoverImage &&
        app.deleteFile({ fileUrl: oldCoverImage });

      if (!luckyDrawModel) {
        ctx.responseFail({
          code: SERVER_CODE.INTERNAL_SERVER_ERROR,
          message: "更新后获取祈愿池异常",
        });
        return;
      }

      const entity = this._luckyDrawModelToEntity(luckyDrawModel);

      ctx.responseSuccess({
        data: entity,
        message: `${id ? "更新" : "创建"}成功`,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async deleteLuckyDraw() {
    const { ctx } = this;
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少祈愿池 id",
        });
        return;
      }
      const luckyDrawModel = await ctx.service.luckyDraw.findLuckyDraw({
        id,
      });

      if (!luckyDrawModel) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "祈愿池不存在",
        });
        return;
      }

      await ctx.service.luckyDraw.deleteLuckyDraw(id);
      ctx.responseSuccess({
        message: "删除成功",
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }

  public async startLuckyDraw() {
    const { ctx } = this;
    const { userId } = ctx.getUserInfo();
    try {
      const { id } = ctx.getParams<{ id: string }>();
      if (!id) {
        ctx.responseFail({
          code: SERVER_CODE.BAD_REQUEST,
          message: "缺少祈愿池 id",
        });
        return;
      }

      const result = await ctx.service.luckyDraw.startDraw({
        id,
        userId,
      });

      ctx.responseSuccess({
        data: result,
      });
    } catch (error) {
      const jsError = ctx.toJsError(error);
      ctx.responseFail({
        code: jsError.code,
        message: jsError?.message,
      });
    }
  }
}

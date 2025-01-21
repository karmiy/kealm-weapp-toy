import Taro from '@tarojs/taro';

enum PREVIEW_IMAGE_ID {
    LIMITED_TIME_OFFER = 'LIMITED_TIME_OFFER'
}

class PreviewImageManager {
  private _storeMap = new Map<string, string[]>();

  private _getImgsById(id: string) {
    return this._storeMap.get(id) ?? [];
  }

  register(id: string, img: string) {
    const items = this._getImgsById(id);
    this._storeMap.set(id, [...items, img]);
  }

  unregister(id: string, img: string) {
    const items = [...this._getImgsById(id)];
    const index = items.findIndex(item => item === img);
    items.splice(index, 1);
    this._storeMap.set(id, items);
  }

  preview(params: { id?: string, current: string } ) {
    const { id, current } = params;
    if (!id) {
      Taro.previewImage({
        current,
        urls: [current],
      });
      return;
    }
    const items = this._getImgsById(id);
    Taro.previewImage({
      current,
      urls: items,
    });
  }
}

const previewImageManager = new PreviewImageManager();

export { previewImageManager, PREVIEW_IMAGE_ID };

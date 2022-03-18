import { ComponentClass } from 'react';
import { AtListItem } from 'taro-ui';
import { classnames } from '@/utils/base';
import styles from './index.module.scss';

type GetProps<T> = T extends ComponentClass<infer U> ? U : never;

type AtListItemProps = GetProps<typeof AtListItem>;

interface Props extends AtListItemProps {
    placeholder?: string;
}

export default function (props: Props) {
    const { placeholder, extraText, ...restProps } = props;

    return (
        <AtListItem
            className={classnames({
                [styles.listItem]: true,
                [styles.isEmpty]: !extraText,
            })}
            {...restProps}
            extraText={extraText ?? placeholder}
        />
    );
}

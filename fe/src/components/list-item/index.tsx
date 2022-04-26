import { AtListItem } from 'taro-ui';
import { classnames } from '@/utils/base';
import { PickerComponentProps } from '@/utils/types';
import styles from './index.module.scss';

type AtListItemProps = PickerComponentProps<typeof AtListItem>;

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
            extraText={extraText || placeholder}
        />
    );
}

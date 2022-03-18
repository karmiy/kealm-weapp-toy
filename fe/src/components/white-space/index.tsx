import { View } from '@tarojs/components';
import { classnames } from '@/utils/base';
import styles from './index.module.scss';

interface Props {
    size?: 'medium' | 'large';
}

export default function (props: Props) {
    const { size } = props;

    return (
        <View
            className={classnames({
                [styles.whiteSpace]: true,
                [styles.isMedium]: size === 'medium',
                [styles.isLarge]: size === 'large',
            })}
        />
    );
}

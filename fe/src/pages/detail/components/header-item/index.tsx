import { Text, View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './index.module.scss';

interface Props {
    className?: string;
    label: string;
    strong: string;
    secondary?: string;
    showSelect?: boolean;
    isSelect?: boolean;
}

export default function (props: Props) {
    const { className, label, strong, secondary, showSelect = false, isSelect = false } = props;

    return (
        <View
            className={`${styles.headerItem} ${className} flex flex-col flex-shrink-0 items-center py-12`}
        >
            <Text className={styles.label}>{label}</Text>
            <View className='mt-8'>
                <Text className={styles.strong}>{strong}</Text>
                {secondary ? <Text className={styles.secondary}>{secondary}</Text> : null}
                {showSelect && (
                    <AtIcon
                        value={isSelect ? 'chevron-up' : 'chevron-down'}
                        className={styles.icon}
                        size={28}
                    />
                )}
            </View>
        </View>
    );
}

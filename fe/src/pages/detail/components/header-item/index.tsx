import { Text, View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './index.module.scss';

interface Props {
    label: string;
    strong: string;
    secondary?: string;
    showSelect?: boolean;
    isSelect?: boolean;
}

export default function (props: Props) {
    const { label, strong, secondary, showSelect = false, isSelect = false } = props;

    return (
        <View className={`${styles.headerItem} flex flex-col items-center px-24 py-12`}>
            <Text className={styles.label}>{label}</Text>
            <View className='mt-8'>
                <Text className={styles.strong}>{strong}</Text>
                {secondary ? <Text className={styles.secondary}>{secondary}</Text> : null}
                {showSelect && (
                    <AtIcon
                        value={isSelect ? 'chevron-up' : 'chevron-down'}
                        className={styles.icon}
                    />
                )}
            </View>
        </View>
    );
}

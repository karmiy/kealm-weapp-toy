import { Text, View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './index.module.scss';

interface Props {
    label?: string;
    strong?: string;
    secondary?: string;
    showSelect?: boolean;
    isSelect?: boolean;
}

export default function (props: Props) {
    const { label } = props;

    return (
        <View className={`${styles.detailItem}`}>
            <View className={`${styles.groupTitle} px-12 flex items-center justify-between`}>
                <Text>03月15日 星期二</Text>
                <View>
                    <Text>收入：3000</Text>
                    <Text className='ml-20'>支出：100</Text>
                </View>
            </View>
            {[...Array(4).keys()].map(index => {
                return (
                    <View
                        key={index}
                        className={`${styles.groupItem} flex justify-between items-center mx-16 py-12`}
                    >
                        <View className='flex flex-col flex-1 overflow-hidden pr-8'>
                            <Text className={styles.type}>工资</Text>
                            <Text className={styles.time}>15:30</Text>
                        </View>
                        <View>
                            {Math.random() > 0.5 ? (
                                <Text className={`${styles.account} text-primary`}>+3000</Text>
                            ) : (
                                <Text className={`${styles.account} text-danger`}>-100</Text>
                            )}
                            <AtIcon
                                className={`${styles.arrow} ml-8`}
                                value='chevron-right'
                                size={16}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

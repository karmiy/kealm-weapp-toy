import {
  Input as TaroInput,
  InputProps as TaroInputProps,
  Textarea as TaroTextarea,
  TextareaProps as TaroTextareaProps,
  View,
} from '@tarojs/components';
import { clsx } from 'clsx';
import styles from './index.module.scss';

interface BaseInputProps {
  inputClassName?: string;
  border?: boolean;
}

type InputProps = TaroInputProps & BaseInputProps;
type TextareaProps = TaroTextareaProps & BaseInputProps;

const Input = (props: InputProps) => {
  const { className, inputClassName, border = true, ...rest } = props;
  return (
    <View className={clsx(styles.inputWrapper, { [styles.isBorder]: border }, className)}>
      <TaroInput
        className={clsx(styles.input, inputClassName)}
        placeholderClass={styles.placeholder}
        {...rest}
      />
    </View>
  );
};

const Textarea = (props: TextareaProps) => {
  const { className, inputClassName, border = true, autoHeight = true, ...rest } = props;
  return (
    <View className={clsx(styles.textareaWrapper, { [styles.isBorder]: border }, className)}>
      {/* 默认有 140 的 max length */}
      <TaroTextarea
        className={clsx(styles.input, inputClassName)}
        placeholderClass={styles.placeholder}
        autoHeight={autoHeight}
        // ios 的 textarea 自带了一点 padding
        disableDefaultPadding
        {...rest}
      />
    </View>
  );
};

export { Input, Textarea };

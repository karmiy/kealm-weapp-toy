import { ComponentType, useMemo, useState } from 'react';
import type { CommonEventFunction, ITouchEvent } from '@tarojs/components';
import { Picker, View } from '@tarojs/components';
import { clsx } from 'clsx';
import isNil from 'lodash/isNil';
import { Icon, Input } from '@ui/components';
import styles from './index.module.scss';

type PickerProps = typeof Picker extends ComponentType<infer Props> ? Props : never;

type PickerSelectorProps = PickerProps & {
  placeholder?: string;
  inputClassName?: string;
  type: 'select' | 'input';
};

const PickerSelector = (props: PickerSelectorProps) => {
  const {
    placeholder,
    inputClassName,
    type,
    onClick: _onClick,
    onCancel: _onCancel,
    onChange: _onChange,
    ...pickerProps
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const inputValue = useMemo(() => {
    switch (pickerProps.mode) {
      case 'selector':
        const selectorList = pickerProps.range;
        const selectorKey = pickerProps.rangeKey;
        const index = pickerProps.value;
        if (isNil(index)) {
          return;
        }
        const selectedValue = selectorList[index];
        if (isNil(selectedValue)) {
          return;
        }
        if (typeof selectedValue === 'object') {
          return selectorKey ? String(selectedValue[selectorKey]) : undefined;
        }
        return String(selectedValue);
      case 'region':
        return pickerProps.value?.join(' ');
      case 'time':
      case 'date':
        return pickerProps.value;
      case 'multiSelector':
        const multiSelectorList = pickerProps.range;
        const multiSelectorKey = pickerProps.rangeKey;
        const indexList = pickerProps.value as number[];
        return indexList
          .map((i, j) => {
            const itemList = multiSelectorList[j];
            const item = itemList[i];
            if (typeof item === 'object') {
              return multiSelectorKey ? String(item[multiSelectorKey]) : undefined;
            }
            return String(item);
          })
          .filter(Boolean)
          .join(' ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pickerProps.mode,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (pickerProps as any).range,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (pickerProps as any).rangeKey,
    pickerProps.value,
  ]);

  const onChange: CommonEventFunction<any> = e => {
    setIsOpen(false);
    _onChange?.(e as any);
  };

  const onClick = (e: ITouchEvent) => {
    setIsOpen(true);
    _onClick?.(e);
  };

  const onCancel: CommonEventFunction = e => {
    setIsOpen(false);
    _onCancel?.(e);
  };

  return (
    <Picker {...pickerProps} onChange={onChange} onClick={onClick} onCancel={onCancel}>
      <View className={clsx(styles.pickerSelectorWrapper, inputClassName)}>
        <Input
          className={styles.input}
          placeholder={placeholder}
          value={inputValue}
          border={false}
          disabled
        />
        {type === 'select' ? (
          <View className={styles.suffix}>
            <Icon name={isOpen ? 'arrow-up' : 'arrow-down'} size={14} />
          </View>
        ) : null}
      </View>
    </Picker>
  );
};

export { PickerSelector };

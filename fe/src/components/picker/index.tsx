import { useState } from 'react';
import {
    BaseEventOrig,
    ITouchEvent,
    Picker,
    PickerDateProps,
    PickerMultiSelectorProps,
    PickerRegionProps,
    PickerSelectorProps,
    PickerTimeProps,
} from '@tarojs/components';

type TaroPickerProps =
    | PickerMultiSelectorProps
    | PickerTimeProps
    | PickerDateProps
    | PickerRegionProps
    | PickerSelectorProps;

type Props = TaroPickerProps & { render: (visible: boolean) => React.ReactNode };

export default function (props: Props) {
    const { render, ...pickerProps } = props;
    const [visible, setVisible] = useState(false);

    const handleClick = (e: ITouchEvent) => {
        pickerProps.onClick?.(e);
        setVisible(true);
    };
    const handleCancel = (e: BaseEventOrig) => {
        pickerProps.onCancel?.(e);
        setVisible(false);
    };
    const handleChange = (e: BaseEventOrig) => {
        pickerProps.onChange?.(e);
        setVisible(false);
    };

    return (
        <Picker
            {...pickerProps}
            onClick={handleClick}
            onCancel={handleCancel}
            onChange={handleChange}
        >
            {render(visible)}
        </Picker>
    );
}

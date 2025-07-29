import { DragControls, MotionValue } from 'framer-motion';
import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
    dragControls: DragControls;
}
declare function ReorderIcon({ dragControls, ...props }: Props): JSX.Element;

declare function useRaisedShadow(value: MotionValue<number>): MotionValue<string>;

export { ReorderIcon, useRaisedShadow };

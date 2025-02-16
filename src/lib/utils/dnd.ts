import {
	type DropAnimation,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	defaultDropAnimationSideEffects,
	useSensor,
	useSensors
} from '@dnd-kit-svelte/core';

export const dropAnimation: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: '0.5'
			}
		}
	})
};

export const sensors = useSensors(useSensor(TouchSensor), useSensor(KeyboardSensor), useSensor(MouseSensor));

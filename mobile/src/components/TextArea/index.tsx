import Input, { InputProps } from "../Input";

export default function TextArea({ numberOfLines, height = 128, ...props }: InputProps) {
	return (
		<Input
			{...props}
			height={height}
			paddingX={props.px ?? props.paddingX ?? "base"}
			paddingY={props.py ?? props.paddingY ?? "base"}
			verticalAlign={props.verticalAlign ?? "top"}
			multiline
		/>
	);
}


type ButtonProps = {
  small?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({
  type = "button",
  small = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  

  return (
    <button
      type={type}
      className="cast-button"
      disabled={disabled}
      {...rest}
    />
  );
}

export interface ILoader {
  stroke?: string;
  path_stroke?: string;
  strokeWidth?: number;
  size?: number | string;
  [k: string]: any;
}

const Loader: React.FC<ILoader> = ({
  stroke,
  path_stroke,
  strokeWidth,
  size,
  ...rest
}) => {
  return (
    <svg
      className="animate-spin"
      viewBox="0 0 24 24"
      width={size ?? 16}
      height={size ?? 16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={stroke}
      {...rest}
    >
      <path
        stroke={path_stroke ?? '#228CF5'}
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth={strokeWidth ?? '2.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Loader;

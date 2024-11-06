import "./index.css";
export type NumericInputProps = {
  value: string;
  setValue: (val: string) => void;
};

const NumericInput = ({ value, setValue }: NumericInputProps) => {
  // const [value, setValue] = useState("");props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only update if the value is empty or is a number
    if (inputValue === "" || /^[0-9\b]+$/.test(inputValue)) {
      setValue(inputValue);
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter a number"
      />
    </div>
  );
};

export default NumericInput;

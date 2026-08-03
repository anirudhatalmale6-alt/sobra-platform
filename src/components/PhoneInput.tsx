// Portuguese phone input. Pre-fills "+351 " but the user can type freely
// (edit or remove the prefix). Stores whatever the user types, trimmed.

type Props = {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
};

export default function PhoneInput({ value, onChange, required }: Props) {
  return (
    <input
      type="tel"
      inputMode="tel"
      value={value}
      required={required}
      placeholder="+351 9XX XXX XXX"
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => {
        // Gentle nudge: start with the country code if the field is empty.
        if (!e.target.value) onChange("+351 ");
      }}
    />
  );
}

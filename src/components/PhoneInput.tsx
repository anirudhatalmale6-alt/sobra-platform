// Portuguese phone input: fixed +351 country code + 9 digits.
// Stores the value as "+351 XXXXXXXXX".

type Props = {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
};

export default function PhoneInput({ value, onChange, required }: Props) {
  const digits = (value || "").replace(/\D/g, "").slice(-9);
  return (
    <div className="phone-input">
      <span className="cc">+351</span>
      <input
        inputMode="numeric"
        value={digits}
        required={required}
        maxLength={9}
        placeholder="9XX XXX XXX"
        onChange={(e) => {
          const d = e.target.value.replace(/\D/g, "").slice(0, 9);
          onChange(d ? `+351 ${d}` : "");
        }}
      />
    </div>
  );
}

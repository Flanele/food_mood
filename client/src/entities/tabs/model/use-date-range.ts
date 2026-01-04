import { parseAsString, useQueryState } from "nuqs";

export const useDateRange = () => {
  const [from, setFrom] = useQueryState("from", parseAsString);
  const [to, setTo] = useQueryState("to", parseAsString);

  return {
    from,
    setFrom,
    to,
    setTo,
    clearRange: () => {
      setFrom(null);
      setTo(null);
    },
  };
};

import { useSortable } from "@dnd-kit/react/sortable";

type SortableProps = {
  id: string | number;
  index: number;
  children: React.ReactNode;
};

export function Sortable({ id, index, children }: SortableProps) {
  const { ref } = useSortable({ id: id, index });

  return <div ref={ref}>{children}</div>;
}

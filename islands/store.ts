import { Link } from "./LinkForm.tsx";
import { signal } from "@preact/signals";

export const links = signal<Link[]>([]);

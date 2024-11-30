import { courseCategories } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function Toolbar({ onSearch, onCategoryChange }: ToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };
  return (
    <div className="toolbar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search course"
        className="toolbar__search"
      />

      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="toolbar__select">
          <SelectValue placeholder="Category" />
        </SelectTrigger>

        <SelectContent className="bg-customgreys-primarybg hover:bg-customgreys-primarybg">
          <SelectItem value="all" className="toolbar__select-item">
            All categories
          </SelectItem>
          {courseCategories.map((category) => (
            <SelectItem
              className="toolbar__select-item"
              key={category.value}
              value={category.value}
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default Toolbar;

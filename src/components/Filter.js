import React, { useState } from "react";
import { Select, Tag, Button } from "antd";
import { tags } from "../Constant";

const { Option } = Select;

const TagSelect = ({
  setFilterDataSource,
  dataSource,
  setFilterTags,
  filterTags,
}) => {
  const [data, setData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tag) => {
    const index = selectedTags.indexOf(tag);
    if (index === -1) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  const OnApply = () => {
    console.log({ dataSource });
    const data = [];
    setFilterTags(selectedTags);
    for (let i = 0; i < dataSource.length; i++) {
      const tags = dataSource[i].tags;
      for (let j = 0; j < filterTags.length; j++) {
        console.log("hey i am ", filterTags[j], dataSource[i].status);
        if (filterTags[j] === dataSource[i].status) {
          data.push(dataSource[i]);
          continue;
        }
      }
      console.log("e", data);
      if (tags) {
        for (let j = 0; j < filterTags.length; j++) {
          for (let k = 0; k < tags.length; k++) {
            if (tags[k].includes(filterTags[j])) {
              data.push(dataSource[i]);
            }
          }
        }
      }
    }
    setFilterDataSource(data);
  };
  // selectedTags.map((item) => {
  //     if(item.labe===)
  // })
  console.log({ filterTags });
  return (
    <div
      style={{
        width: "60%",
        gap: "20px",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <Select
        mode="tags"
        placeholder="Filter by tag"
        value={selectedTags}
        onChange={(tags) => setSelectedTags(tags)}
        style={{ width: "40%" }}
      >
        {tags.map((tag) => (
          <Option key={tag.value} value={tag.label}>
            <Tag
              color={selectedTags.includes(tag.label) ? "blue" : undefined}
              onClick={() => handleTagClick(tag.label)}
              style={{ cursor: "pointer" }}
            >
              {tag.label}
            </Tag>
          </Option>
        ))}
      </Select>
      <Button onClick={OnApply}>Apply Changes</Button>
    </div>
  );
};

export default TagSelect;

import "antd-css-utilities/utility.min.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import "./App.css";
import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TagSelect from "./components/Filter";
import { tags } from "./Constant";
// import Item from "antd/es/list/Item";

function App() {
  const time = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [selectedTags, setSelectedTags] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [addTask, setAddTask] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [filterDataSource, setFilterDataSource] = useState([]);
  const [filterTags, setFilterTags] = useState([]);

  const columns = [
    {
      key: "1",
      title: "Timestamp created",
      dataIndex: "time",
    },
    {
      key: "2",
      title: "Title",
      required: true,
      dataIndex: "title",
      width: 40,
      alignItems: "center",
    },
    {
      key: "3",
      title: "Description",
      dataIndex: "description",
      width: 60,
    },
    {
      key: "4",
      title: "Due Date",
      dataIndex: "due",
    },
    {
      key: "5",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditTask(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteTask(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
    {
      key: "6",
      title: "Tags",
      dataIndex: "tags",
    },
    {
      key: "7",
      title: "Status",
      dataIndex: "status",
    },
  ];

  const actions = [
    { label: "OPEN", value: 1 },
    { label: "WORKING", value: 2 },
    { label: "DONE", value: 3 },
    { label: "OVERDUE", value: 4 },
  ];

  const tags = [
    { label: "Important", value: 1 },
    { label: "Urgent", value: 2 },
    { label: "Personal", value: 3 },
    { label: "react", value: 4 },
    { label: "html", value: 5 },
  ];

  const handleCreateOption = (inputValue) => {
    const newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue,
    };

    setSelectedTags([...selectedTags, newOption]);
  };

  const onAddTask = () => {
    console.log("here i am adding task");
    if (due < time) {
      alert("Due date cannot be before current date");
      return;
    }
    if (title === "") {
      alert("Title is required");
      return;
    }
    if (description === "") {
      alert("Description is required");
      return;
    }
    if (status === "") {
      alert("Status is required");
      return;
    }

    const newTask = {
      id: dataSource.length + 1,
      time: time,
      title: title,
      description: description,
      due: due,
      tags:
        selectedTags.length &&
        selectedTags?.map((i, index) => {
          if (index !== selectedTags.length) {
            i.label = i.label + ", ";
          }

          return i.label;
        }),

      status: status,
    };
    setDataSource((pre) => {
      return [...pre, newTask];
    });
    setTitle("");
    setDescription("");
    setDue("");
    setStatus("");
    setSelectedTags("");
    setAddTask(false);
  };

  const onDeleteTask = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this task record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((task) => task.id !== record.id);
        });
      },
    });
  };

  const onEditTask = (record) => {
    setIsEditing(true);
    setEditingTask({ ...record });
  };

  const handleMultiSelect = (selected) => {
    setSelectedTags(selected);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingTask(null);
  };
  console.log({ filterDataSource });
  return (
    <div className="App">
      <header className="App-header">
        <div className="header">
          <TagSelect
            setFilterDataSource={setFilterDataSource}
            dataSource={dataSource}
            setFilterTags={setFilterTags}
            filterTags={filterTags}
          />
          <Button
            onClick={() => {
              setAddTask(true);
            }}
            className="button"
          >
            Add task
          </Button>
        </div>
        <Modal
          title="Add task"
          open={addTask}
          okText="Save"
          onCancel={() => {
            setAddTask(false);
          }}
          onOk={() => {
            onAddTask();
          }}
        >
          <Input
            value={title}
            required
            placeholder="title"
            maxLength={100}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <Input
            value={description}
            maxLength={1000}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            placeholder="description"
          />
          <Input
            name="submittion-date"
            value={due}
            type="date"
            min={Date.now()}
            onChange={(event) => {
              setDue(event.target.value);
            }}
          />

          <CreatableSelect
            isMulti
            value={selectedTags}
            placeholder="Tag"
            options={tags}
            onChange={handleMultiSelect}
            onCreateOption={handleCreateOption}
          />

          <Select
            options={actions}
            placeholder="Status"
            onChange={(event) => {
              setStatus(event.label);
            }}
          />
        </Modal>

        <Table
          columns={columns}
          dataSource={filterTags.length > 0 ? filterDataSource : dataSource}
          className="ant-table-cell ant-table-thead"
        ></Table>

        <Modal
          title="Edit Task"
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((task) => {
                if (task.id === editingTask.id) {
                  return editingTask;
                } else {
                  return task;
                }
              });
            });
            resetEditing();
          }}
        >
          <Input
            value={editingTask?.title}
            maxLength={100}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, title: e.target.value };
              });
            }}
          />
          <Input
            value={editingTask?.description}
            maxLength={1000}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, description: e.target.value };
              });
            }}
          />
          <Input
            name="submittion-date"
            value={editingTask?.due}
            type="date"
            min={Date.now()}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, due: e.target.value };
              });
            }}
          />
          <CreatableSelect
            isMulti
            value={editingTask?.selectedTags}
            options={tags}
            onCreateOption={handleCreateOption}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, selectedTags: e.label };
              });
            }}
          />
          <Select
            value={editingTask?.status}
            onChange={(e) => {
              setEditingTask((pre) => {
                return { ...pre, status: e.label };
              });
            }}
            options={actions}
          />
        </Modal>
      </header>
    </div>
  );
}

export default App;

// selectedTags on edit

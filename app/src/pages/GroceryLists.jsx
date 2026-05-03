import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const emptyItem = { name: "", quantity: "", checked: false };

function GroceryLists() {
  const [lists, setLists] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("Grocery List");
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "";

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }),
    [user]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchLists = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/grocery-lists`, config);
        setLists(response.data);
        if (response.data.length) {
          selectList(response.data[0]);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load grocery lists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, [API_URL, config, navigate, user]);

  const selectList = (list) => {
    setSelectedId(list._id);
    setTitle(list.title);
    setItems(list.items.length ? list.items : [{ ...emptyItem }]);
  };

  const updateItem = (index, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prevItems) => [...prevItems, { ...emptyItem }]);
  };

  const removeItem = (index) => {
    setItems((prevItems) => {
      const nextItems = prevItems.filter((_, itemIndex) => itemIndex !== index);
      return nextItems.length ? nextItems : [{ ...emptyItem }];
    });
  };

  const generateList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/grocery-lists/generate`,
        {},
        config
      );
      setLists((prevLists) => [response.data, ...prevLists]);
      selectList(response.data);
      toast.success("Grocery list generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate grocery list");
    } finally {
      setIsLoading(false);
    }
  };

  const saveList = async (event) => {
    event.preventDefault();

    if (!selectedId) {
      toast.error("Generate a grocery list before saving");
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/api/grocery-lists/${selectedId}`,
        { title, items },
        config
      );
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === response.data._id ? response.data : list
        )
      );
      selectList(response.data);
      toast.success("Grocery list saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save grocery list");
    }
  };

  const exportList = () => {
    if (!selectedId) {
      toast.error("Choose a grocery list to export");
      return;
    }

    const content = [
      title,
      "",
      ...items
        .filter((item) => item.name.trim())
        .map((item) => `${item.checked ? "[x]" : "[ ]"} ${item.quantity} ${item.name}`.trim()),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "grocery-list"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Grocery list exported");
  };

  const deleteList = async () => {
    if (!selectedId) {
      toast.error("Choose a grocery list to delete");
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/grocery-lists/${selectedId}`, config);
      const remainingLists = lists.filter((list) => list._id !== selectedId);
      setLists(remainingLists);
      if (remainingLists.length) {
        selectList(remainingLists[0]);
      } else {
        setSelectedId("");
        setTitle("Grocery List");
        setItems([{ ...emptyItem }]);
      }
      toast.success("Grocery list deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete grocery list");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="grocery-page">
      <div className="grocery-header">
        <div>
          <h1>Grocery Lists</h1>
          <p>Generate, edit, export, and delete shopping lists.</p>
        </div>
        <button className="btn" type="button" onClick={generateList}>
          Generate List
        </button>
      </div>

      <div className="grocery-layout">
        <aside className="grocery-sidebar">
          {lists.length ? (
            lists.map((list) => (
              <button
                className={list._id === selectedId ? "grocery-list-link active" : "grocery-list-link"}
                key={list._id}
                type="button"
                onClick={() => selectList(list)}
              >
                <span>{list.title}</span>
                <small>{list.items.length} items</small>
              </button>
            ))
          ) : (
            <p>No grocery lists yet.</p>
          )}
        </aside>

        <form className="grocery-editor" onSubmit={saveList}>
          <div className="form-group">
            <label htmlFor="title">List Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="grocery-items">
            {items.map((item, index) => (
              <div className="grocery-item-row" key={`${item.name}-${index}`}>
                <input
                  aria-label="Purchased"
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) => updateItem(index, "checked", event.target.checked)}
                />
                <input
                  aria-label="Quantity"
                  type="text"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(event) => updateItem(index, "quantity", event.target.value)}
                />
                <input
                  aria-label="Item"
                  type="text"
                  placeholder="Item"
                  value={item.name}
                  onChange={(event) => updateItem(index, "name", event.target.value)}
                />
                <button
                  className="btn grocery-remove"
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="grocery-actions">
            <button className="btn" type="button" onClick={addItem}>
              Add Item
            </button>
            <button className="btn" type="submit">
              Save Changes
            </button>
            <button className="btn" type="button" onClick={exportList}>
              Export
            </button>
            <button className="btn grocery-delete" type="button" onClick={deleteList}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default GroceryLists;

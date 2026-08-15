import { useEffect, useState } from "react";
import axios from "axios";

function AddSubjects() {
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState([]);

  // 📥 load all subjects
  const loadSubjects = async () => {
    const res = await axios.get("http://localhost:5000/api/subjects/all");
    setSubjects(res.data);
    console.log(subjects)
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // ☑️ checkbox toggle
  const handleCheck = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // ➕ assign to class
  const saveSubjects = async () => {
    await axios.post("http://localhost:5000/api/subjects/assign", {
      class_name: className,
      subject_ids: selected,
    });

    alert("Subjects Assigned!");
    setSelected([]);
  };

  return (
    <div className="content">
      <h2>Assign Subjects to Class</h2>

      {/* CLASS SELECT */}
      <select onChange={(e) => setClassName(e.target.value)} className="dropdown">
        <option>Select Class</option>
        <option>Play Group</option>
        <option>Nursery</option>
        <option>KG</option>
        <option>1st</option>
        <option>2nd</option>
        <option>3rd</option>
        <option>4th</option>
        <option>5th</option>
        <option>6th</option>
        <option>7th</option>
        <option>8th</option>
      </select>

      {/* CHECKBOX LIST */}
      <div className="checkbox-list">
        {subjects.map((sub) => (
          <label key={sub.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={selected.includes(sub.id)}
              onChange={() => handleCheck(sub.id)}
            />
            {sub.subject_name}
          </label>
        ))}
      </div>

      <button onClick={saveSubjects}>Save Subjects</button>
    </div>
  );
}

export default AddSubjects;
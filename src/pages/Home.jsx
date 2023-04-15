import { NotePencil } from "@phosphor-icons/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [noteTitle, setNoteTitle] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    axios
      .post("http://localhost:8000/api/create", { title: noteTitle })
      .then(function (response) {
        navigate(`/${noteTitle}`);
      })
      .catch(function (error) {
        if (error.response.data == "Title already in use") {
          navigate(`/${noteTitle}`);
        } else console.log(error);
      });
  }

  return (
    <div className="flex h-screen flex-col items-center justify-around">
      <div className="flex items-center justify-center gap-2 text-3xl">
        <NotePencil size={32} /> NiceNotes
      </div>
      <div className="flex flex-col items-center gap-2 rounded-md bg-zinc-100 p-4 shadow-md">
        <div className="mb-1 text-xl">Criar nota</div>
        <input
          className="w-full rounded-md p-2 shadow-md"
          type="text"
          maxLength={16}
          placeholder="Insira um título..."
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-indigo-400 p-2 text-xl shadow-md"
        >
          Criar
        </button>
      </div>
    </div>
  );
}

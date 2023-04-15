import { useEffect, useState } from "react";
import { FloppyDisk, NotePencil, Trash } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";

export default function Note() {
  const [content, setContent] = useState(null);
  const [newContent, setNewContent] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [noteExists, setNoteExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { note: noteTitle } = useParams();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/${noteTitle}`
        );

        setNoteExists(true);
        setNewContent(response.data[0].content);
      } catch (error) {
        switch (error.response.data) {
          case "Missing note":
            break;
          case "Missing password":
            break;

          default:
            break;
        }
      }
      setIsLoading(false);
    }
    getUser();
  }, []);

  function handleSave() {
    axios
      .put(`http://localhost:8000/api/edit/${noteTitle}`, {
        content: newContent,
      })
      .then(function (response) {
        console.log("Salvo com sucesso");
      })
      .catch(function (error) {
        console.log(error);
      });
    setContent(newContent);
  }

  function handleDelete() {
    axios
      .delete(`http://localhost:8000/api/delete/${noteTitle}`)
      .then(function (response) {
        navigate("/");
      });
  }

  if (isLoading) return;

  if (noteExists)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-14 bg-zinc-100 pt-6 sm:px-6">
        <div className="flex items-center justify-center gap-2 text-3xl max-sm:mt-8">
          <NotePencil size={32} /> NiceNotes
        </div>
        <div className="flex h-4/5 w-full max-w-7xl flex-col gap-2 border bg-white p-2 shadow-md max-sm:flex-1 max-sm:rounded-t-lg sm:rounded-lg">
          <div className="flex justify-between p-4">
            <div className="text-2xl">{noteTitle}</div>
            <div className="flex gap-2">
              <button className="relative" onClick={handleSave}>
                {content !== newContent && (
                  <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></div>
                )}
                <FloppyDisk className="hover:text-blue-500" size={28} />
              </button>
              <button onClick={() => setIsOpen(!isOpen)}>
                <Trash className="hover:text-red-500" size={28} />
              </button>
            </div>
          </div>
          <textarea
            className="w-full flex-1 resize-none rounded-md p-4 focus:outline-none"
            maxLength={65535}
            value={newContent || ""}
            placeholder="Coloca um texto ai..."
            onChange={(e) => {
              setNewContent(e.target.value);
            }}
          />
          <DeleteModal />
        </div>
      </div>
    );
  else
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <div>Nota não existente</div>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Criar nota
        </button>
      </div>
    );

  function DeleteModal() {
    return (
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-zinc-100 p-4 shadow-md">
            <Dialog.Title className="text-2xl">Deletar nota</Dialog.Title>
            <div>Tem Certeza?</div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg bg-indigo-300 p-4 shadow-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-300 p-4 shadow-md"
              >
                Sim
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }
}

import './App.css';

import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "https://api-tarefas-alpha.vercel.app/lista-tarefas";

function App() {

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API)
        .then((res) => res.json())
        .catch((err) => console.log(err));

      setLoading(false);
      setTodos(res);  
    };

    loadData();  
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    // Envia a nova tarefa para a API
    await fetch(API, {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);  
    setTitle("");  
    setTime("");   
  };

  const handleDelete = async (id) => {
    // Deleta a tarefa da API
    await fetch(API + "/" + id, {
      method: "DELETE"
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));  
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done;  

    // Atualiza a tarefa na API
    const data = await fetch(API + "/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json());

    setTodos((prevState) => 
      prevState.map((t) => (t.id === data.id ? data : t)) 
    );
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Liste suas tarefas!</h1>
      </div>

      <div className="form-todo">
        <h2>Insira a tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input
              type="text"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>

      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}h</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? (
                  <BsBookmarkCheck className="icon-green" />
                ) : (
                  <BsBookmarkCheckFill />
                )}
              </span>
              <BsTrash className="icon-red" onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <div className="App container">
    <div className="row">
    <div className="col">
      <div className="fs-1">Minhas Notas</div>
      <div className="mb-3">
        <label className="form-label">Nome da nota</label>
        <input
            className="form-control"
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            placeholder="Nome da nota"
            value={formData.name}
          />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <input
          className="form-control"
          onChange={e => setFormData({ ...formData, 'description': e.target.value})}
          placeholder="Descrição"
          value={formData.description}
        />
      </div>
      <button onClick={createNote}>Criar Nota</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Deletar nota</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
    </div>
    </div>
  );
}

export default withAuthenticator(App);

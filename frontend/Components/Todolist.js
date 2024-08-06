import React, { useState } from 'react';

const Todolist = () => {
  const inputStyle = {
    border: '1px solid black',
    padding: '5px',
    borderRadius: '5px',
    
  };
  const [list,setList]=useState([])
  const[editingItem,setEditingItem]=useState({
    id:"",
    isEditing:false
  })

  const [message,setMessage]=useState({
    text:"",
    id:""
  });
 const changeMessage=(e)=>{
  setMessage({
    ...message,
    text:e.target.value
  })
  
 }
 const handleSubmit=(e)=>{
  e.preventDefault();
  let newTodo={
    text:message.text,
    id:new Date().getTime().toString()
  }
  setList([...list,newTodo])
  setMessage({
    text:"",
    id:""
  })
 }
 const handleDelete=(id)=>{
  let newTodo=list.filter((eachItem)=>{
    return eachItem.id!==id;
  })
  setList(newTodo)

 }
const handleEditState=(id)=>{
  setEditingItem({
    ...editingItem,
    id:id,
    isEditing:true
  })
  const editableItem=list.find((eachItem)=>eachItem.id===id);
  setMessage({
    ...message,
    text:editableItem.text,
    id:editableItem.id
  })

}

const handleEdit = (e) => {
  e.preventDefault();
  let newTodo = list.map((eachItem) => {
    if (eachItem.id === editingItem.id) {
      return {
        text: message.text,
        id: editingItem.id
      };
    } else {
      return eachItem;
    }
  });
  setList(newTodo);
  setMessage({
    text: "",
    id: ""
  });
  setEditingItem({
    id: "",
    isEditing: false
  });
};


  return (
    <div>
      <h1>This is a simple todo-list</h1>
      <form onSubmit={handleSubmit} >
        <input 
          type="text" 
          id="message" 
          name="message" 
          value={message.text}
          placeholder="Type your message" 
          onChange={changeMessage}
          style={inputStyle} 
        />
       {editingItem.isEditing ? (
          <button onClick={handleEdit} type="submit">
            edit
          </button>
        ) : (
          <button onClick={handleSubmit} type="submit">
            add
          </button>
        )}
        
      </form>
      <hr />
      {list.length===0 && <h1>there is empty list</h1>}
      <hr />
      <ul>
      {
        list.map((eachItem)=>{
          const {text,id}=eachItem;
          return <li key={id}>
              <span>{text}</span>
              <button style={inputStyle} onClick={()=>handleEditState(id)}>Edit</button>
              <button style={inputStyle} onClick={()=>handleDelete(id)}>Delete</button>

          </li>
        })
      }
      </ul>


    </div>
  );
}

export default Todolist;

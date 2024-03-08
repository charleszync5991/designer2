"use client";
import { useEffect, useState } from "react";
import { Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import axios from "axios";
import LoadingSkeleton from "./LoadingSkeleton";
import { DndContext } from "@/context/DndContext";

interface Cards {
  id: number;
  title: string;
  components: {
    id: number;
    name: string;
  }[];
}

const DndExample = () => {
  const [data, setData] = useState<Cards[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const newData = [...data];
      const oldDroppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId.split("droppable")[1]
      );
      const newDroppableIndex = newData.findIndex(
        (x) => x.id == destination.droppableId.split("droppable")[1]
      );
      const [item] = newData[oldDroppableIndex].components.splice(
        source.index,
        1
      );
      newData[newDroppableIndex].components.splice(destination.index, 0, item);
      setData(newData);
    } else {
      const newData = [...data];
      const droppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId.split("droppable")[1]
      );
      const [item] = newData[droppableIndex].components.splice(source.index, 1);
      newData[droppableIndex].components.splice(destination.index, 0, item);
      setData(newData);
    }
  };

  useEffect(() => {
    // Sample initial data
    const initialData: Cards[] = [
      {
        id: 0,
        title: "Main Page",
        components: [
          { id: 100, name: "Card1" },
          { id: 200, name: "Card2" },
        ],
      },
      {
        id: 1,
        title: "Component Selection",
        components: [
          { id: 300, name: "Card3" },
          { id: 400, name: "Card4" },
          { id: 500, name: "Card5" },
          { id: 600, name: "Card6" },
          { id: 700, name: "Card7" },
        ],
      },
    ];
    setData(initialData);
  }, []);

  const removeComponent = (cardId: number, componentIndex: number) => {
    const newData = [...data];
    if (cardId === 1) return; // Do not allow removal if it's from card with id 1
    newData
      .find((card) => card.id === cardId)
      ?.components.splice(componentIndex, 1);
    setData(newData);
  };

  const addNewSection = () => {
    const newId = data.length;
    const newSection: Cards = {
      id: newId,
      title: `Section ${newId}`,
      components: [],
    };
    setData([...data, newSection]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post("YOUR_BACKEND_API_URL", data);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error while submitting data:", error);
      alert("Failed to submit data. Please try again.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <h1 className="text-center mt-8 mb-3 font-bold text-[25px] ">
        Drag and Drop Application
      </h1>
      <div className="flex gap-4 justify-between my-20 mx-4 flex-col lg:flex-row">
        {data.map((val, index) => (
          <Droppable key={index} droppableId={`droppable${index}`}>
            {(provided) => (
              <div
                className="p-5 lg:w-1/3 w-full bg-white border-gray-400 border border-dashed"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="text-center font-bold mb-6 text-black">
                  {val.title}
                </h2>
                {val.components.map((component, componentIndex) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id.toString()}
                    index={componentIndex}
                  >
                    {(provided) => (
                      <div
                        className="bg-gray-200 mx-1 px-4 py-3 my-3"
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        {component.name}
                        {val.id !== 1 && (
                          <button
                            className="ml-2 text-red-500"
                            onClick={() =>
                              removeComponent(val.id, componentIndex)
                            }
                          >
                            X
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
      <div className="text-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
          onClick={addNewSection}
        >
          Add New Section
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </DndContext>
  );
};

export default DndExample;

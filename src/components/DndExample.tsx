"use client";

import { cardsData } from "@/bin/CardsData";
import { useEffect, useState } from "react";
import { Draggable, Droppable, DropResult } from "react-beautiful-dnd";
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
    setData(cardsData);
  }, []);

  const removeComponent = (cardId: number, componentIndex: number) => {
    const newData = [...data];
    if (cardId === 1) return; // Do not allow removal if it's from card with id 1
    newData
      .find((card) => card.id === cardId)
      ?.components.splice(componentIndex, 1);
    setData(newData);
  };

  if (!data.length) {
    return <LoadingSkeleton />;
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <h1 className="text-center mt-8 mb-3 font-bold text-[25px] ">
        Designer2
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
    </DndContext>
  );
};

export default DndExample;

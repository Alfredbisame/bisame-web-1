"use client";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

interface EditCloseButtonProps {
  id: string;
  onEdit: (productId: string) => void;
  onClose: (productId: string) => void;
}

const EditCloseButton: React.FC<EditCloseButtonProps> = ({
  id,
  onEdit,
  onClose,
}) => {
  return (
    <div className="flex justify-between items-center mt-3">
      <button
        onClick={() => onEdit(id)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors duration-200"
      >
        <FaEdit className="mr-1" size={12} />
        Edit
      </button>
      <button
        onClick={() => onClose(id)}
        className="flex items-center text-red-600 hover:text-red-800 text-xs font-semibold transition-colors duration-200"
      >
        {/* <FaTimes className="mr-1" size={12} /> */}
        <MdOutlineDelete className="mr-1" size={12} />
        Delete
      </button>
    </div>
  );
};

export default EditCloseButton;

"use client";

export default function ReloadStatusButton() {
  const reloadStatus = async () => {
    fetch("/api/gate", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Status reloaded:", data);
      })
      .catch((error) => {
        console.error("Error reloading status:", error);
      });
  };

  return (
    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" onClick={reloadStatus}>
      Reload Status
    </button>
  );
}

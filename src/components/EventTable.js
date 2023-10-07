import React, { useState } from "react";

const EventTable = ({ events, onClickRow }) => {
  const handleRowClick = (data) => {
    onClickRow(data);
  };

  return (
    <div className="overflow-x-auto">
      <h1 className="text-left mb-2 font-bold">LỊCH ĐẶT SÂN ({ events.length })</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              NGÀY
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              GIỜ
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              SÂN
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              SỐ SÂN
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              GIỚI HẠN
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              HẠN HUỶ
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              CẬP NHẬT
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events &&
            events.map((event) => {
              const updatedDatetime = new Date(event.data.updated.toDate());
              const deadlineDatetime = new Date(event.data.deadline.toDate());
              const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false, // Use 24-hour format
              };
              const updatedAt = updatedDatetime.toLocaleString(undefined, options);
              const deadlineAt = deadlineDatetime.toLocaleString(undefined, options);

              return !event.data.completed && (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {event.data.title.split(', ')[0] + ', ' + event.data.title.split(', ')[1]}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      {event.data.reservedTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {event.data.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      {event.data.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      {event.data.participant}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      { deadlineAt.split(',')[0] }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left" onClick={() => handleRowClick(event)}>
                    <div className="text-sm leading-5 text-gray-900">
                      {updatedAt}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;

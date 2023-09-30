import React from "react";

const User = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Point
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Facebook ID
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users &&
            users.map((user) => {
              const createdAt = new Date(user.data.created.toDate());

              return (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {user.data.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      {user.data.point}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      {user.data.fbId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-left">
                    <div className="text-sm leading-5 text-gray-900">
                      {createdAt.toDateString()}
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

export default User;

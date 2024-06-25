import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { IoCopy } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoQrCodeOutline } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const Dashboard_Loginned = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 760px)" });
  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/authenticate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          return response.data.user;
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        console.log(err);
        window.location.href = "/login";
        return null;
      }
    };

    const fetchUrls = async (user) => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/loggedin/${user._id}/urls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const transformedUrls = response.data.urls.newLink.map((newLink, index) => ({
            shortUrl: newLink,
            longUrl: response.data.urls.oldLink[index],
            qrCode: (user.subscription === "Free" || user.subscription === null || new Date(user.endDateOfSubscription) < new Date()) ? "-" : `http://localhost:3000/linkly/qr/${newLink.split('/').pop()}`,
            clicks: (user.subscription === "Free" || user.subscription === null || new Date(user.endDateOfSubscription) < new Date()) ? "-" : user.Viewer[index] || 0,
          }));
          return transformedUrls;
        } else {
          throw new Error("Failed to fetch URLs");
        }
      } catch (error) {
        console.error("Error fetching URLs:", error);
        return [];
      }
    };

    const fetchData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUser(userData);
        const urlsData = await fetchUrls(userData);
        setUrls(urlsData);
      }
    };

    fetchData(); // Fetch initial data

    const intervalId = setInterval(fetchData, 200); // Fetch data every 200ms

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const dashboardColumns = useMemo(
    () => [
      {
        Header: "Short Link",
        accessor: "shortUrl",
        Cell: ({ cell: { value } }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {highlightText(value, searchQuery)}
          </a>
        ),
      },
      {
        Header: "Long Link",
        accessor: "longUrl",
        Cell: ({ cell: { value } }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {highlightText(value, searchQuery)}
          </a>
        ),
      },
      {
        Header: "QR Code",
        accessor: "qrCode",
        Cell: ({ cell: { value } }) =>
          value === "-" ? (
            "-"
          ) : (
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <IoQrCodeOutline style={{ fontSize: "24px" }} />
            </a>
          ),
      },
      {
        Header: "Clicks",
        accessor: "clicks",
        Cell: ({ cell: { value } }) => value,
      },
    ],
    [searchQuery]
  );

  const filteredData = useMemo(
    () => urls.filter(url => 
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) || 
      url.longUrl.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [urls, searchQuery]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: dashboardColumns,
    data: filteredData,
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert(text + " copied to clipboard");
  }

  return (
    <div style={{ width: "80%", margin: "auto", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
      </div>
      <table {...getTableProps()} className="table" style={{ width: "100%", alignItems: "center" }}>
        <thead
          style={{
            backgroundColor: "#181E29",
            height: "40px",
            border: "1px solid #181E29",
            borderRadius: "15px 15px 0 0",
          }}
        >
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ border: "1px solid #353C4A" }}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        margin: "auto",
                        padding: "auto",
                        textAlign: "center",
                      }}
                    >
                      {cell.column.id === "shortUrl" && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {cell.render("Cell")}
                          <button
                            onClick={() => copyToClipboard(cell.value)}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#181E29",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <IoCopy />
                          </button>
                        </div>
                      )}
                      {cell.column.id === "longUrl" && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          {cell.render("Cell")}
                          <button
                            onClick={() => copyToClipboard(cell.value)}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "#181E29",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <IoCopy />
                          </button>
                        </div>
                      )}
                      {cell.column.id !== "shortUrl" && cell.column.id !== "longUrl" && cell.render("Cell")}
                      {isMobile && (
                        <button
                          style={{
                            marginLeft: "120px",
                            backgroundColor: "#0B101B",
                            marginRight: "-180px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <IoIosArrowDropdown />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard_Loginned;
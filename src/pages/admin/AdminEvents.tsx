import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface EventItem {
    id: string;
    competitionNumber: number;
    name: string;
    maxMarks: number;
    totalStudents: number;
    submittedResults: number;
    publishedResults: number;
    status: string;
}

const AdminEvents = () => {

    const navigate = useNavigate();

    const [events, setEvents] =
        useState<EventItem[]>([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        loadEvents();

    }, []);


    const loadEvents = async () => {

        try {

            const response =
                await api.get(
                    "/admin/events"
                );

            setEvents(
                response.data.events
            );

        } catch (error) {

            console.error(
                "Failed to load events",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    if (loading) {

        return (
            <div style={{
                padding: "30px"
            }}>
                Loading events...
            </div>
        );
    }


    return (

        <div style={{
            padding: "30px"
        }}>

            <h1>Competition Events</h1>


            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px"
                }}
            >

                <thead>

                    <tr>

                        <th>No.</th>

                        <th>Competition</th>

                        <th>Students</th>

                        <th>Submitted</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    {events.map(event => (

                        <tr key={event.id}>

                            <td>
                                {event.competitionNumber}
                            </td>

                            <td>
                                {event.name}
                            </td>

                            <td>
                                {event.totalStudents}
                            </td>

                            <td>
                                {event.submittedResults}
                                {" / "}
                                {event.totalStudents}
                            </td>

                            <td>

                                {event.status ===
                                    "PUBLISHED"
                                    ? "Published"
                                    : event.status ===
                                        "READY_TO_PUBLISH"
                                        ? "Ready to Publish"
                                        : "Waiting"}

                            </td>


                            <td>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/events/${event.competitionNumber}`
                                        )
                                    }
                                >
                                    View Results
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
};

export default AdminEvents;
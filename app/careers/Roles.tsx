"use client";

import { useEffect, useState } from "react";

type Role = {
  id: string;
  title: string;
  jobId: string;
  departmentName: string;
  teamName: string;
  locationName: string;
  workplaceType: string;
  employmentType: string;
  isListed: boolean;
  publishedDate: string;
  applicationDeadline: string | null;
  externalLink: string;
  applyLink: string;
  locationIds: {
    primaryLocationId: string;
    secondaryLocationIds: string[];
  };
  compensationTierSummary: string;
  shouldDisplayCompensationOnJobBoard: boolean;
  updatedAt: string;
};

function Roles() {
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetch("/api/careers")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setRoles(data.roles);
        }
      });
  }, []);
  return (
    <div>
      {roles.map((role) => (
        <div
          key={role.id}
          className="my-8 flex flex-row justify-between items-center text-basis text-lg"
        >
          <h3 className="font-medium m-0">
            <a
              href={role.externalLink}
              className="hover:underline"
              target="_blank"
            >
              {role.title}
            </a>
          </h3>
          <p className="m-0">{role.locationName}</p>
        </div>
      ))}
      {error
        ? "Check the job board for all open roles"
        : roles.length === 0 && <p>There are currently no open roles.</p>}
    </div>
  );
}

export default Roles;

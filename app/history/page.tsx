"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

interface StarredItem {
  type: "school_match" | "major_mentor" | "story_strategist";
  id: number;
  title: string;
  description: string;
  why_recommendation: string;
  created_at: string;
}

interface MajorMentorItem {
  id: number;
  major_title: string;
  description_of_major: string;
  why_this_major: string;
  starred: boolean;
  created_at: string;
}

interface SchoolMatchItem {
  id: number;
  college_name: string;
  description_of_college: string;
  why_this_college: string;
  starred: boolean;
  created_at: string;
}

interface StoryStrategistItem {
  id: number;
  title: string;
  summary: string;
  starred: boolean;
  created_at: string;
}

interface SessionHistoryItem {
  output_group: string;
  table_name: string;
  display_name: string;
  display_title: string;
  display_description: string;
  created_at: string;
}

type DropdownOption =
  | "favorites"
  | "major_mentor"
  | "school_match"
  | "story_strategist";

export default function History() {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [starredItems, setStarredItems] = useState<StarredItem[]>([]);
  const [majorMentorItems, setMajorMentorItems] = useState<MajorMentorItem[]>(
    [],
  );
  const [schoolMatchItems, setSchoolMatchItems] = useState<SchoolMatchItem[]>(
    [],
  );
  const [storyStrategistItems, setStoryStrategistItems] = useState<
    StoryStrategistItem[]
  >([]);
  const [sessionHistoryItems, setSessionHistoryItems] = useState<
    SessionHistoryItem[]
  >([]);
  const [isLoadingSessionHistory, setIsLoadingSessionHistory] = useState(false);

  const fetchData = async (option: DropdownOption) => {
    setIsLoading(true);
    setSelectedOption(option);

    try {
      let endpoint = "";

      switch (option) {
        case "favorites":
          endpoint = "/api/db/getAllStarred";
          break;
        case "major_mentor":
          endpoint = "/api/db/getMajorMentor";
          break;
        case "school_match":
          endpoint = "/api/db/getSchoolMatch";
          break;
        case "story_strategist":
          endpoint = "/api/db/getStoryStrategist";
          break;
        default:
          return;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        switch (option) {
          case "favorites":
            setStarredItems(data.data);
            break;
          case "major_mentor":
            setMajorMentorItems(data.data);
            break;
          case "school_match":
            setSchoolMatchItems(data.data);
            break;
          case "story_strategist":
            setStoryStrategistItems(data.data);
            break;
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch ${option} data`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching ${option} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "school_match":
        return "School Match";
      case "major_mentor":
        return "Major Mentor";
      case "story_strategist":
        return "Story Strategist";
      default:
        return type;
    }
  };

  const getSelectedOptionLabel = () => {
    switch (selectedOption) {
      case "favorites":
        return "Favorites";
      case "major_mentor":
        return "Major Mentor";
      case "school_match":
        return "School Match Maker";
      case "story_strategist":
        return "Story Strategies";
      default:
        return "Select an option";
    }
  };

  const fetchSessionHistory = async () => {
    setIsLoadingSessionHistory(true);

    try {
      const response = await fetch("/api/db/getSessionHistory");
      const data = await response.json();

      if (data.success) {
        setSessionHistoryItems(data.data);
      } else {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch session history");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching session history:", error);
    } finally {
      setIsLoadingSessionHistory(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${month}/${day}/${year} ${displayHours}:${minutes} ${ampm}`;
  };

  const renderFavorites = () => (
    <div className="space-y-4">
      {starredItems.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">No starred items found.</p>
          </CardBody>
        </Card>
      ) : (
        starredItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} className="w-full">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <div className="flex justify-between items-start w-full">
                <div>
                  <h4 className="font-bold text-large text-primary">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {getTypeLabel(item.type)}
                  </p>
                </div>
                <span className="text-2xl">⭐</span>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 px-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                    Description
                  </h5>
                  <p className="text-sm">{item.description}</p>
                </div>
                {item.why_recommendation && (
                  <div>
                    <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                      Why This Recommendation
                    </h5>
                    <p className="text-sm">{item.why_recommendation}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );

  const renderMajorMentor = () => (
    <div className="space-y-4">
      {majorMentorItems.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">
              No major mentor recommendations found.
            </p>
          </CardBody>
        </Card>
      ) : (
        majorMentorItems.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <div className="flex justify-between items-start w-full">
                <h4 className="font-bold text-large text-primary">
                  {item.major_title}
                </h4>
                <span className="text-2xl">{item.starred ? "⭐" : "☆"}</span>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 px-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                    Description of Major
                  </h5>
                  <p className="text-sm">{item.description_of_major}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                    Why This Major
                  </h5>
                  <p className="text-sm">{item.why_this_major}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );

  const renderSchoolMatch = () => (
    <div className="space-y-4">
      {schoolMatchItems.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">
              No school match recommendations found.
            </p>
          </CardBody>
        </Card>
      ) : (
        schoolMatchItems.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <div className="flex justify-between items-start w-full">
                <h4 className="font-bold text-large text-primary">
                  {item.college_name}
                </h4>
                <span className="text-2xl">{item.starred ? "⭐" : "☆"}</span>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 px-4">
              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                    Description of College
                  </h5>
                  <p className="text-sm">{item.description_of_college}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                    Why This College
                  </h5>
                  <p className="text-sm">{item.why_this_college}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );

  const renderStoryStrategist = () => (
    <div className="space-y-4">
      {storyStrategistItems.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">
              No story strategist recommendations found.
            </p>
          </CardBody>
        </Card>
      ) : (
        storyStrategistItems.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
              <div className="flex justify-between items-start w-full">
                <h4 className="font-bold text-large text-primary">
                  {item.title}
                </h4>
                <span className="text-2xl">{item.starred ? "⭐" : "☆"}</span>
              </div>
            </CardHeader>
            <CardBody className="overflow-visible py-2 px-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm">{item.summary}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardBody>
            <p className="text-center">Loading...</p>
          </CardBody>
        </Card>
      );
    }

    switch (selectedOption) {
      case "favorites":
        return renderFavorites();
      case "major_mentor":
        return renderMajorMentor();
      case "school_match":
        return renderSchoolMatch();
      case "story_strategist":
        return renderStoryStrategist();
      default:
        return (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500">
                Select an option from the dropdown to view your saved items.
              </p>
            </CardBody>
          </Card>
        );
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-4xl font-bold text-center mb-8">History</h1>

      <div className="w-full max-w-4xl">
        <Tabs aria-label="History options" className="w-full">
          <Tab key="saved" title="My Saved Stuff">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="capitalize" variant="bordered">
                      {getSelectedOptionLabel()}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Select saved items type"
                    onAction={(key) => fetchData(key as DropdownOption)}
                  >
                    <DropdownItem key="favorites">Favorites</DropdownItem>
                    <DropdownItem key="major_mentor">Major Mentor</DropdownItem>
                    <DropdownItem key="school_match">
                      School Match Maker
                    </DropdownItem>
                    <DropdownItem key="story_strategist">
                      Story Strategies
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              {selectedOption && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    {getSelectedOptionLabel()}
                  </h3>
                  {renderContent()}
                </div>
              )}

              {!selectedOption && renderContent()}
            </div>
          </Tab>
          <Tab key="session" title="Session History">
            <div className="space-y-4">
              {sessionHistoryItems.length === 0 && !isLoadingSessionHistory ? (
                <div className="text-center">
                  <Button
                    className="mb-4"
                    color="primary"
                    variant="bordered"
                    onClick={fetchSessionHistory}
                  >
                    Load Session History
                  </Button>
                  <p className="text-gray-500">
                    Click to load your session history.
                  </p>
                </div>
              ) : isLoadingSessionHistory ? (
                <Card>
                  <CardBody>
                    <p className="text-center">Loading session history...</p>
                  </CardBody>
                </Card>
              ) : (
                sessionHistoryItems.map((item) => (
                  <Card
                    key={`${item.table_name}-${item.output_group}`}
                    className="w-full"
                  >
                    <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                      <div className="flex justify-between items-start w-full">
                        <div>
                          <h4 className="font-bold text-large text-primary">
                            {item.display_name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(item.created_at)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          Session ID: {item.output_group.slice(0, 8)}...
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 px-4">
                      <div className="space-y-2">
                        <div>
                          <h5 className="font-semibold text-sm text-primary">
                            {item.display_title}
                          </h5>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {item.display_description}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
}

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlockTypeTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  setFilters: (filters: any) => void;
  theme: string;
}

const BlockTypeTabs = ({
  activeTab,
  setActiveTab,
  setFilters,
  theme,
}: BlockTypeTabsProps) => {
  return (
    <Tabs
      defaultValue="all"
      value={activeTab}
      className="w-full"
      onValueChange={(value) => {
        setActiveTab(value);
        setFilters((prev: any) => ({
          ...prev,
          blockName: "", // Reset block filter when changing blockType
          blockType: value !== "all" ? value : "", // Update blockType filter
        }));
      }}
    >
      <TabsList
        className={`grid w-full grid-cols-4 mb-6 ${
          theme === "dark" ? "bg-purple-950" : "bg-purple-100"
        } p-1 rounded-lg shadow-lg`}
      >
        <TabsTrigger
          value="all"
          className={`${
            theme === "dark" ? "text-purple-300" : "text-purple-700"
          } data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-2 rounded-md transition-all`}
        >
          All Blocks
        </TabsTrigger>
        <TabsTrigger
          value="boys"
          className={`${
            theme === "dark" ? "text-purple-300" : "text-purple-700"
          } data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-2 rounded-md transition-all`}
        >
          Boys Hostel
        </TabsTrigger>
        <TabsTrigger
          value="girls"
          className={`${
            theme === "dark" ? "text-purple-300" : "text-purple-700"
          } data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-2 rounded-md transition-all`}
        >
          Girls Hostel
        </TabsTrigger>
        <TabsTrigger
          value="mt"
          className={`${
            theme === "dark" ? "text-purple-300" : "text-purple-700"
          } data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md px-4 py-2 rounded-md transition-all`}
        >
          MT Blocks
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BlockTypeTabs;

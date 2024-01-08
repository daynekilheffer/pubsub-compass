import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import SubscriptionList from "./SubscriptionList";
import TopicList from "./TopicList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TopicSubTabs = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Topics" {...a11yProps(0)} />
        <Tab label="Subscriptions" {...a11yProps(0)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <TopicList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SubscriptionList />
      </CustomTabPanel>
    </>
  )
}

export default TopicSubTabs

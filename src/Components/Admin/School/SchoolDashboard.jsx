import { TabPanel, TabView } from "primereact/tabview";
import { BiDetail, BiGroup, BiUser, BiUserPin } from "react-icons/bi";
import SchoolForm from "./SchoolForm";
import Student from "./Students";
import Teacher from "./Teacher";
export default function SchoolDashboard({ data }) {
  return (
    <div className="">
      <TabView>
        <TabPanel
          header="Update School"
          leftIcon={<BiDetail className="mr-2" />}
        >
          <SchoolForm label={"u"} data={data} />
        </TabPanel>
        <TabPanel header="Teacher" leftIcon={<BiGroup className="mr-2" />}>
          <Teacher school={data?._id} />
        </TabPanel>
        <TabPanel header="Student" leftIcon={<BiUser className="mr-2" />}>
          <Student school={data?._id} />
        </TabPanel>
        <TabPanel
          header="School Admin"
          leftIcon={<BiUserPin className="mr-2" />}
        >
          <Student school={data?._id} />
        </TabPanel>
      </TabView>
    </div>
  );
}

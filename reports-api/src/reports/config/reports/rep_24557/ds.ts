
import { DataSource } from "@/reports/types/DataSource";


export default  new DataSource({
    functionName: "report_util.get_rep_24557",
    paramsBinding: {
      p_дата:"date",
      p_отделение_id:"dep",
      p_участок_id:"uchastok"
    },
  });

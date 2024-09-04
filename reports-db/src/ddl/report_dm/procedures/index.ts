import fill_all from "./fill_all";
import fill_dim_дата from "./fill_dim_дата";
import fill_msr_фин from "./fill_msr_фин";
import fill_msr_фин_начисл from "./fill_msr_фин_начисл";
import fill_msr_фин_обор from "./fill_msr_фин_обор";
import fill_msr_фин_обор_просроч from "./fill_msr_фин_обор_просроч";
import fill_msr_фин_опл_кредит from "./fill_msr_фин_опл_кредит";
import fill_msr_фин_опл_погаш from "./fill_msr_фин_опл_погаш";
import fill_msr_фин_сальдо_по_дог from "./fill_msr_фин_сальдо_по_дог";
import fill_msr_фин_сальдо_по_дог_вид_реал from "./fill_msr_фин_сальдо_по_дог_вид_реал";

export default [
  fill_dim_дата,
  fill_msr_фин_начисл,
  fill_msr_фин_опл_погаш,
  fill_msr_фин_опл_кредит,
  fill_msr_фин_обор,
  fill_msr_фин_сальдо_по_дог_вид_реал,
  fill_msr_фин_сальдо_по_дог,
  fill_msr_фин,
  fill_all,
  fill_msr_фин_обор_просроч,
];

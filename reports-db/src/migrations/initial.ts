import { QueryInterface } from 'sequelize';
import test_view from '../declaration/obj/test_view';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface:QueryInterface) {
    // await queryInterface.sequelize.query(`
    //   DROP VIEW IF EXISTS public.sales_view CASCADE;
    //   CREATE OR REPLACE VIEW public.sales_view
    //   AS select sale from  public.sales s;
    // `);

    await queryInterface.sequelize.query(test_view.deleteSql());
    await queryInterface.sequelize.query(test_view.createSql());
  },
};
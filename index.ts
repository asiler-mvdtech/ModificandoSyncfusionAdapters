import { Grid, Edit, Page, Selection, Toolbar } from '@syncfusion/ej2-grids';
import {
  DataManager,
  ODataV4Adaptor,
  Predicate,
  Query,
} from '@syncfusion/ej2-data';

Grid.Inject(Toolbar, Edit, Page, Selection);

/**
 * RemoteData sample
 */
class CustomAdaptor extends ODataV4Adaptor {
  beforeSend(dm, request, settings) {
    let url = settings.url; //En settings.url está la url ya generada
    console.log('beforeSend', arguments, 'La url original era ', url);
    //debugger;
    url = 'https://services.syncfusion.com/js/production/api/orders';
    if (settings.type == 'GET') {
      //cambio la url porque da error este ejemplo
      request.open('GET', url); //El método y la url se pueden cambiar con un nuevo open
      dm.dataSource.headers = [{ UserIDMVD: '1234' }, { pppp: '11111' }]; //También se pueden cambiar los headers
    } else if (settings.type == 'PATCH') {
      //debugger;
      //url += '?ppppp';
      let body = JSON.parse(settings.data);
      //body.ppp = 123; //se puede cambiar solo una propiedad
      body = { ppp: 123, xxxx: 'aaaaa' }; // o sustituir todo
      settings.data = JSON.stringify(body); // hay que recordar hacer stringify
      request.open('GET', url); //El método y la url se pueden cambiar con un nuevo open. Se puede cambiar de servidor por ejemplo y de método. En este caso hago un get porque la api de syncfusion no soporta el patch y al dar error no se da el processResponse de abajo.
      dm.dataSource.headers = [{ UserIDMVD: '5678' }]; //También se pueden cambiar los headers
    }
  }
  processResponse(data, ds, query, xhr, request, changes) {
    console.log('processResponse', arguments);
    //debugger;
    if (request.type == 'GET') {
      var ret = [];
      ret.push({
        OrderID: 10001,
        CustomerID: 'ALFKI Cambiado en processResponse',
        EmployeeID: 1,
        Freight: 2.3,
        ShipCity: 'Berlin',
        Verified: false,
        OrderDate: '1991-05-15T00:00:00.000Z',
        ShipName: 'Simons bistro',
        ShipCountry: 'Denmark',
        ShippedDate: '1996-07-16T00:00:00.000Z',
        ShipAddress: 'Kirchgasse 6',
      });
      return { result: ret, count: ret.length };
    } else {
      return {
        OrderID: 10001,
        CustomerID: 'ALFKI Actualizado en processResponse',
        EmployeeID: 1,
        Freight: 2.3,
        ShipCity: 'Berlin',
        Verified: false,
        OrderDate: '1991-05-15T00:00:00.000Z',
        ShipName: 'Simons bistro',
        ShipCountry: 'Denmark',
        ShippedDate: '1996-07-16T00:00:00.000Z',
        ShipAddress: 'Kirchgasse 6',
      };
    }
  }
}

let hostUrl: string = 'https://services.syncfusion.com/js/production/api';
let data: Object = new DataManager({
  url: hostUrl,
  adaptor: new CustomAdaptor(),
  crossDomain: true,
});
let predicate = new Predicate('EmployeeID', 'equal', 3);
predicate = predicate.or('EmployeeID', 'equal', 2);
var querySource = new Query().from('EventDatas').where(predicate);

let grid: Grid = new Grid({
  dataSource: data,
  query: querySource,
  allowPaging: true,
  editSettings: {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
  },
  toolbar: ['Add', 'Edit', 'Delete'],
  columns: [
    {
      field: 'OrderID',
      headerText: 'Order ID',
      width: 130,
      textAlign: 'Right',
      isPrimaryKey: true,
    },
    { field: 'CustomerID', headerText: 'Customer ID', width: 170 },
    {
      field: 'EmployeeID',
      headerText: 'Employee ID',
      width: 135,
      textAlign: 'Right',
    },
    {
      field: 'Freight',
      headerText: 'Freight',
      width: 160,
      textAlign: 'Right',
      format: 'C2',
    },
    {
      field: 'ShipCountry',
      headerText: 'Ship Country',
      width: 150,
      textAlign: 'Center',
    },
  ],
});
grid.appendTo('#Grid');

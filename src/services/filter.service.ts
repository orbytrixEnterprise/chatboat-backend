export class FilterService {

    static addFilterValue(filter: string, field: string, element: any) {
        let condition = "";

        switch (element.type) {
            case "contains":
                condition = `${field} LIKE '%${element.value}%'`;
                break;

            case "equals":
                condition = `${field} = '${element.value}'`;
                break;

            case "start with":
                condition = `${field} LIKE '${element.value}%'`;
                break;

            case "end with":
                condition = `${field} LIKE '%${element.value}'`;
                break;
        }

        if (condition) {
            filter += `(${condition})`;
        }

        return filter;
    }
}

// export class FilterService {

//     static addFilterValue(filter: string, field: string, element: any) {
//         switch (element.type) {
//             case "contains":
//                 filter += (filter.length > 0 ? " OR " : "") + field + " LIKE '%" + element.value + "%'";
//                 break;
//             case "equals":
//                 filter += (filter.length > 0 ? " OR " : "") + field + " = '" + element.value + "'";
//                 break;
//             case "start with":
//                 filter += (filter.length > 0 ? " OR " : "") + field + " LIKE '" + element.value + "%'";
//                 break;
//             case "end with":
//                 filter += (filter.length > 0 ? " OR " : "") + field + " LIKE '%" + element.value + "'";
//                 break;
//         }
//         return filter;
//     }

// }
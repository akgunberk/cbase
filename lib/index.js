var $WOmHB$path = require("path");
var $WOmHB$commander = require("commander");
var $WOmHB$chalk = require("chalk");
var $WOmHB$process = require("process");
var $WOmHB$fs = require("fs");
var $WOmHB$inquirer = require("inquirer");
var $WOmHB$util = require("util");
require("dotenv/config");
var $WOmHB$axios = require("axios");
var $WOmHB$xmljs = require("xml-js");
var $WOmHB$dotenv = require("dotenv");
var $WOmHB$ora = require("ora");
var $WOmHB$stream = require("stream");
var $WOmHB$console = require("console");
var $WOmHB$prismaclient = require("@prisma/client");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "program", () => $49200a88616f5c5f$export$ee72801824c03e63);
var $7ef301c08eaf134d$exports = {};
$7ef301c08eaf134d$exports = JSON.parse("{\"name\":\"cbase\",\"version\":\"1.0.0\",\"description\":\"Bring codabasehq into your terminal\",\"keywords\":[\"cli\",\"codebasehq\"],\"author\":\"Berk Akgun\",\"license\":\"ISC\",\"source\":\"src/index.ts\",\"main\":\"lib/index.js\",\"type\":\"commonjs\",\"bin\":{\"cbase\":\"lib/index.js\"},\"publishConfig\":{\"@YOUR-USERNAME:registry\":\"https://npm.pkg.github.com\"},\"scripts\":{\"test\":\"jest --watch\",\"type-check\":\"tsc --noEmit\",\"postinstall\":\"npm run prisma\",\"prisma\":\"npx prisma migrate dev --name initial-migration\",\"dev\":\"nodemon --watch src -e ts --exec \\\"npm run build\\\"\",\"build1\":\"tsc && babel src --out-dir lib --extensions \\\".ts,.js,.json\\\"\",\"watch\":\"parcel watch\",\"build\":\"parcel build\"},\"devDependencies\":{\"@types/inquirer\":\"^8.1.3\",\"@types/node\":\"^17.0.9\",\"@types/xml2js\":\"^0.4.9\",\"typescript\":\"^4.5.4\",\"parcel\":\"latest\"},\"dependencies\":{\"@prisma/client\":\"^3.9.1\",\"axios\":\"^0.24.0\",\"chalk\":\"^4.1.2\",\"commander\":\"^8.3.0\",\"dotenv\":\"^14.2.0\",\"inquirer\":\"^8.2.0\",\"ora\":\"^5.1.0\",\"xml-js\":\"^1.6.11\"}}");















const $a7aecb6c090f1d5b$export$44be4d60e373b0c8 = "https://api3.codebasehq.com";
const $a7aecb6c090f1d5b$export$8bcc626a3662ddca = {
    compact: true,
    trim: true,
    textKey: "text",
    ignoreComment: true,
    ignoreAttributes: true,
    ignoreDeclaration: true,
    explicitArray: true
};
const $a7aecb6c090f1d5b$export$4f76510003766d01 = {
    baseURL: $a7aecb6c090f1d5b$export$44be4d60e373b0c8,
    timeout: 3000,
    headers: {
        Accept: "application/xml",
        "Content-Type": "application/xml"
    },
    transformResponse: [
        (xml)=>{
            if (xml) try {
                const json = JSON.parse($WOmHB$xmljs.xml2json(xml, $a7aecb6c090f1d5b$export$8bcc626a3662ddca));
                return json;
            } catch (error) {
                return xml;
            }
        }, 
    ]
};
const $a7aecb6c090f1d5b$export$538a4a49c4b9cbab = {
    assigned: "assignee:me",
    sort: "sort:priority"
};
const $a7aecb6c090f1d5b$export$f893bee9f765a0ff = [
    "id",
    "type",
    "status",
    "priority",
    "status",
    "summary"
];
const $a7aecb6c090f1d5b$export$c7b28f121ca10671 = $WOmHB$process.stdout.columns - 4;
const $a7aecb6c090f1d5b$export$f1209e49e18d6513 = [
    "ticket-id",
    "ticket-type",
    "reporter",
    "assignee-id",
    "priority-id",
    "category-id",
    "status-id",
    "summary", 
];
const $a7aecb6c090f1d5b$export$186da88dacaa2273 = [
    "content",
    "updated-at",
    "user-id",
    "updates"
];
const $a7aecb6c090f1d5b$export$91a19ee5dcaaf6ed = {
    get: `
Get last 10 tickets assigned to me: 
cbase get  
By default, assigned tickets are queried. use -a to specify assignee
cbase get -a <username> 

Negative values: Add a ! before the field name
cbase get -t !Bug      display tickets with type not(Bug)

You can use multiple word queries by comma
cbase get -t Bug,Feature     display Bug and Feature type tickets

Multiple values: Comma separate values
cbase get -t Bug -p High     display assigned High priority Bug type tickets
`,
    set: `
Update status:
$ gh codebase (ticket|t) <id> -s "In Progress"

Update multiple field: (you can use interactive mode: gh codebase t -i)
$ gh codebase (ticket|t) <id> -s "In Progress" -a berk-akgun

Display timeline of the ticket:
$ gh codebase (ticket|t) <id> -n
    or
$ gh codebase (ticket|t) <id> -n 5 (Last 5 updates)


Add a comment:
$ gh codebase (ticket|t) <id> -C "Who wants to grab a beer after work?"
or
$ gh codebase (ticket|t) <id> -S "(DUPLICATE): ...." -C "Ticket is duplicated, updating it as invalid." -s Invalid

`
};











const $8f83ea1763790a89$export$b9fa49fbc83b1fb2 = new $WOmHB$prismaclient.PrismaClient({
    log: []
});
async function $8f83ea1763790a89$export$6c7236b7429f91e8(user) {
    return $8f83ea1763790a89$export$b9fa49fbc83b1fb2.user.upsert({
        where: {
            id: user.id
        },
        update: {
            project: {
                connect: {
                    projectName_userId: {
                        projectName: undefined,
                        userId: user.id
                    }
                }
            }
        },
        create: {
            ...user,
            project: {
                connect: {
                    projectName_userId: {
                        projectName: undefined,
                        userId: user.id
                    }
                }
            }
        }
    });
}
async function $8f83ea1763790a89$export$6f798d83dabb652d() {
    return $8f83ea1763790a89$export$b9fa49fbc83b1fb2.project.findUnique({
        where: {
            name: undefined
        },
        include: {
            users: true
        }
    });
}
async function $8f83ea1763790a89$export$929d678737a9c29d([types, statuses, categories, priorities, users]) {
    const projectName = undefined;
    try {
        for (const user of users){
            const { id: id , username: username , firstName: firstName , lastName: lastName  } = $eafba1a88b5307ad$export$bd3042240529272b(user, [
                "id",
                "username",
                "first-name",
                "last-name", 
            ]);
            await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.user.upsert({
                where: {
                    id: id
                },
                update: {
                },
                create: {
                    id: id,
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    project: {
                        connectOrCreate: {
                            where: {
                                projectName_userId: {
                                    projectName: projectName,
                                    userId: id
                                }
                            },
                            create: {
                                projectName: projectName
                            }
                        }
                    }
                }
            });
        }
        for (const type of types){
            const data = {
                ...$eafba1a88b5307ad$export$bd3042240529272b(type, [
                    "id",
                    "name",
                    "icon"
                ]),
                projectName: projectName
            };
            await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.type.upsert({
                where: {
                    name: data.name
                },
                update: {
                    projectName: projectName
                },
                create: data
            });
        }
        for (const status of statuses){
            const data = {
                ...$eafba1a88b5307ad$export$bd3042240529272b(status, [
                    "id",
                    "name",
                    "colour",
                    "treat-as-closed"
                ]),
                projectName: projectName
            };
            await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.status.upsert({
                where: {
                    name: data.name
                },
                update: {
                    projectName: projectName
                },
                create: data
            });
        }
        for (const category of categories){
            const data = {
                ...$eafba1a88b5307ad$export$bd3042240529272b(category, [
                    "id",
                    "name"
                ]),
                projectName: projectName
            };
            await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.category.upsert({
                where: {
                    name: data.name
                },
                update: {
                    projectName: projectName
                },
                create: data
            });
        }
        for (const priority of priorities){
            const data = {
                ...$eafba1a88b5307ad$export$bd3042240529272b(priority, [
                    "id",
                    "name",
                    "colour"
                ]),
                projectName: projectName
            };
            await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.priority.upsert({
                where: {
                    name: data.name
                },
                update: {
                    projectName: projectName
                },
                create: data
            });
        }
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("Couldn't save project details.");
        $WOmHB$process.exit(1);
    }
    return;
}
async function $8f83ea1763790a89$export$a1e5c04c89b5bd35(projects) {
    for (const name of projects)await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.project.upsert({
        where: {
            name: name
        },
        update: {
        },
        create: {
            name: name
        }
    });
    return;
}
async function $8f83ea1763790a89$export$3b875dcb63f77fbe(name) {
    return $8f83ea1763790a89$export$b9fa49fbc83b1fb2.codebaseQuery.findUnique({
        where: {
            name: name
        }
    });
}
async function $8f83ea1763790a89$export$dc3c8ec2500dd7b7({ name: name , query: query  }) {
    return $8f83ea1763790a89$export$b9fa49fbc83b1fb2.codebaseQuery.upsert({
        where: {
            name: name
        },
        update: {
            query: query
        },
        create: {
            username: undefined,
            name: name,
            query: query
        }
    });
}
async function $8f83ea1763790a89$export$b2c8652ae76baf() {
    const project = await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.project.findFirst({
        where: {
            name: undefined
        },
        include: {
            users: {
                orderBy: {
                    user: {
                        username: "desc"
                    }
                }
            },
            priorities: {
                orderBy: {
                    name: "desc"
                }
            },
            statuses: {
                orderBy: {
                    name: "desc"
                }
            },
            types: {
                orderBy: {
                    name: "desc"
                }
            },
            categories: {
                orderBy: {
                    name: "desc"
                }
            },
            tickets: true
        }
    });
    return project;
}
async function $8f83ea1763790a89$export$16d4b050c91c6b25() {
    return $8f83ea1763790a89$export$b9fa49fbc83b1fb2.codebaseQuery.findMany({
        where: {
            username: undefined
        }
    });
}
async function $8f83ea1763790a89$export$6d1ce2cb2280821b() {
    const statuses = await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.status.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return statuses;
}
async function $8f83ea1763790a89$export$e5205c3fc0cd8db6() {
    const priorities = await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.priority.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return priorities;
}
async function $8f83ea1763790a89$export$1c4bb93498097c2d() {
    const users = await $8f83ea1763790a89$export$b9fa49fbc83b1fb2.user.findMany({
        select: {
            id: true,
            username: true
        }
    });
    return users;
}






const $eafba1a88b5307ad$export$641374ffb95bc399 = ($parcel$interopDefault($WOmHB$ora))();
function $eafba1a88b5307ad$export$35a8f55d0558254c(answers) {
    try {
        $WOmHB$fs.writeFileSync(".env", Object.entries(answers).map((answer)=>answer.join("=")
        ).join("\n"));
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred while saving your credentials.");
        $WOmHB$process.exit(1);
    }
}
function $eafba1a88b5307ad$export$88ed64d9a8c4dc4e() {
    const { username: username , password: password , project: project  } = ($parcel$interopDefault($WOmHB$dotenv)).config().parsed || {
    };
    if (username && password) return {
        username: username,
        password: password,
        project: project
    };
    $eafba1a88b5307ad$export$641374ffb95bc399.fail("You need to log in with: cbase log in");
    $WOmHB$process.exit(0);
}
function $eafba1a88b5307ad$export$7b85fd78dd236198(input) {
    if (Array.isArray(input)) return input;
    return [
        input
    ];
}
function $eafba1a88b5307ad$export$ef9a8611cdd50d03(cells, chunk) {
    const chunkSize = cells.length / chunk > 1 ? chunk : cells.length;
    return cells.reduce((tabular, cell, index)=>{
        if (index % chunkSize === 0) tabular.push([]);
        tabular[tabular.length - 1].push(cell);
        return tabular;
    }, []);
}
function $eafba1a88b5307ad$export$bd3042240529272b(obj, keys) {
    const pickedObject = {
    };
    for (const key of keys)if (key in obj) {
        let value = obj[key].text;
        if ([
            "true",
            "false"
        ].includes(obj[key].text)) value = value === "true";
        pickedObject[$eafba1a88b5307ad$export$4e2d767d23cc93ee(key)] = value;
    }
    return pickedObject;
}
function $eafba1a88b5307ad$export$4e2d767d23cc93ee(word1) {
    return word1.split("-").map((word, index)=>index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join("");
}
function $eafba1a88b5307ad$export$7128756d03dbde02(queries) {
    return Object.entries(queries).map((query)=>query.join(":")
    ).join(" ");
}
async function $eafba1a88b5307ad$export$bbd6435d6176fff9(answers) {
    const { comment: comment , subject: subject , privateUpdate: privateUpdate , ...changes } = answers;
    const [status, priority, category, type, assignee] = await Promise.all([
        $8f83ea1763790a89$export$b9fa49fbc83b1fb2.status.findUnique({
            where: {
                name: changes.status ?? "*"
            }
        }),
        $8f83ea1763790a89$export$b9fa49fbc83b1fb2.priority.findUnique({
            where: {
                name: changes.priority ?? "*"
            }
        }),
        $8f83ea1763790a89$export$b9fa49fbc83b1fb2.category.findUnique({
            where: {
                name: changes.category ?? "*"
            }
        }),
        $8f83ea1763790a89$export$b9fa49fbc83b1fb2.type.findUnique({
            where: {
                name: changes.type ?? "*"
            }
        }),
        $8f83ea1763790a89$export$b9fa49fbc83b1fb2.user.findUnique({
            where: {
                username: changes.assignee ?? "*"
            }
        }), 
    ]);
    const payload = `<ticket-note>
${comment && comment !== "*" ? `<content>${comment}</content>` : ""}
<changes>
${subject && subject !== "*" ? `<subject>${subject}</subject>` : ""}
${assignee ? `<assignee-id>${assignee.id}</assignee-id>` : ""}
${type ? `<ticket-type-id>${type.id}</ticket-type-id>` : ""}
${status ? `<status-id>${status.id}</status-id>` : ""}
${priority ? `<priority-id>${priority.id}</priority-id>` : ""}
${category ? `<category-id>${category.id}</category-id>` : ""}
</changes>
${privateUpdate ? "<private>1</private>" : ""}
</ticket-note>
`.replace(/\n/g, "");
    return payload;
}
async function $eafba1a88b5307ad$export$70db5978a071ae83(ticketId, limit) {
    const users = await $8f83ea1763790a89$export$1c4bb93498097c2d();
    const timelineEvents = [];
    const timelineSeparator = ($parcel$interopDefault($WOmHB$chalk)).redBright("\n┃\n┃\n");
    for (const xmlUpdateNote of (await $868664d0d3c4005e$export$8a191ba96f432ae8(ticketId)).slice(limit * -1)){
        const { content: content , updatedAt: updatedAt , userId: userId , updates: updates  } = $eafba1a88b5307ad$export$bd3042240529272b(xmlUpdateNote, $a7aecb6c090f1d5b$export$186da88dacaa2273);
        const timestamp = "on " + new Date(updatedAt).toDateString() + " at " + updatedAt.replace("Z", "").split("T").pop();
        const username = users.find((user)=>user.id === userId
        )?.username;
        const changedFields = Object.entries(JSON.parse(updates));
        const changes = [];
        if (content) {
            const highlights = [
                username,
                timestamp
            ].map((item)=>($parcel$interopDefault($WOmHB$chalk)).whiteBright(item)
            ).concat(($parcel$interopDefault($WOmHB$chalk)).italic.redBright(content));
            changes.push($WOmHB$util.format("%s commented %s\n%s", ...highlights));
        }
        if (changedFields.length) for (const [changedField, [from, to]] of changedFields){
            const field = changedField.split("_")[0].toUpperCase();
            const highlights = [
                username,
                field,
                from,
                to,
                timestamp
            ].map((item)=>($parcel$interopDefault($WOmHB$chalk)).whiteBright(item)
            );
            changes.push($WOmHB$util.format("%s changed %s from %s to %s on %s", ...highlights));
        }
        timelineEvents.push(changes.join("\n"));
    }
    console.log(($parcel$interopDefault($WOmHB$chalk)).underline.greenBright(`Last ${limit} updates:`));
    console.log(timelineEvents.join(timelineSeparator));
    return;
}
async function $eafba1a88b5307ad$export$23324e4f3fd0169c(tickets, limit = 10) {
    const { users: users , priorities: priorities , statuses: statuses , categories: categories  } = await $8f83ea1763790a89$export$b2c8652ae76baf();
    function formatXmlTicket(xmlTicket) {
        const { ticketId: ticketId , ticketType: ticketType , reporter: reporter , assigneeId: assigneeId , priorityId: priorityId , categoryId: categoryId , statusId: statusId , summary: summary  } = $eafba1a88b5307ad$export$bd3042240529272b(xmlTicket, $a7aecb6c090f1d5b$export$f1209e49e18d6513);
        return {
            id: ticketId,
            type: ticketType,
            reporter: reporter,
            category: categories.find((category)=>category.id === categoryId
            )?.name,
            priority: priorities.find((priority)=>priority.id === priorityId
            )?.name,
            status: statuses.find((status)=>status.id === statusId
            )?.name,
            assignee: users.find((user)=>user.userId === assigneeId
            )?.username,
            summary: summary.slice(0, $a7aecb6c090f1d5b$export$c7b28f121ca10671 / 3).padEnd($a7aecb6c090f1d5b$export$c7b28f121ca10671 / 3, " ")
        };
    }
    const tableContent = tickets.length === 1 ? [
        formatXmlTicket(tickets[0])
    ] : tickets.slice(0, limit).map((xmlTicket)=>formatXmlTicket(xmlTicket)
    );
    console.clear();
    console.table(tableContent, $a7aecb6c090f1d5b$export$f893bee9f765a0ff);
    return;
}
function $eafba1a88b5307ad$export$2d35fc1c790ede(cells, header, column = 6) {
    const stdout = new $WOmHB$stream.Transform({
        transform (chunk, _, cb) {
            cb(null, chunk);
        }
    });
    const logger = new $WOmHB$console.Console({
        stdout: stdout
    });
    const table = $eafba1a88b5307ad$export$ef9a8611cdd50d03(cells, column);
    logger.table(table);
    const rows = (stdout.read() || "").toString().split(/[\r\n]+/);
    const rowWidth = rows[0].length;
    return rows.map((row, index)=>{
        if (index === 0) return row.replace(/┬/g, "─");
        if (index === 2) return row.replace(/┼/g, "┬");
        if (index === 1) {
            const pad = Math.floor((rowWidth - 2) / 2) + Math.floor(header.length / 2);
            return "│" + header.padStart(pad).padEnd(rowWidth - 2) + "│";
        }
        return row;
    }).join("\n");
}



const $868664d0d3c4005e$var$API = ($parcel$interopDefault($WOmHB$axios)).create({
    ...$a7aecb6c090f1d5b$export$4f76510003766d01
});
async function $868664d0d3c4005e$export$85d699ca8330b9a9(auth) {
    try {
        $eafba1a88b5307ad$export$641374ffb95bc399.start("Authenticating...");
        const { data: data  } = await $868664d0d3c4005e$var$API.get("/profile", {
            auth: auth
        });
        $eafba1a88b5307ad$export$641374ffb95bc399.stop();
        return data.user;
    } catch (error) {
        if (error.status === 401) $eafba1a88b5307ad$export$641374ffb95bc399.fail("Check your credentials.");
        else $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting your profile.");
        $WOmHB$process.exit(1);
    }
}
async function $868664d0d3c4005e$export$b00a271f69f3d728() {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/projects`);
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data.projects.project);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting projects that you involved.");
        $WOmHB$process.exit(1);
    }
}
async function $868664d0d3c4005e$export$2596ab7ef92449e4({ project: project , ...auth }) {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${project}/tickets/types`, {
            auth: auth
        });
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["ticketing-types"]["ticketing-type"]);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting ticket types of your project.");
    }
}
async function $868664d0d3c4005e$export$dcc5d2f98fd9404b({ project: project , ...auth }) {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${project}/tickets/statuses`, {
            auth: auth
        });
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["ticketing-statuses"]["ticketing-status"]);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting your profile.");
    }
}
async function $868664d0d3c4005e$export$489e9c0d7da0a5e2({ project: project , ...auth }) {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${project}/tickets/priorities`, {
            auth: auth
        });
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["ticketing-priorities"]["ticketing-priority"]);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting priorities of your project.");
    }
}
async function $868664d0d3c4005e$export$7a0f33e8df10bd94({ project: project , ...auth }) {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${project}/tickets/categories`, {
            auth: auth
        });
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["ticketing-categories"]["ticketing-category"]);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting categories of your project.");
    }
}
async function $868664d0d3c4005e$export$925a4945a6cd0f3e({ project: project , ...auth }) {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${project}/assignments`, {
            auth: auth
        });
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["users"]["user"]);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting assignees of your project.");
    }
}
async function $868664d0d3c4005e$export$8a191ba96f432ae8(id) {
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${undefined}/tickets/${id}/notes`);
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["ticket-notes"]["ticket-note"]);
    } catch (error) {
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred getting your ticket updates");
        $WOmHB$process.exit(1);
    }
}
async function $868664d0d3c4005e$export$91f71c9bcfb4cf89(query, page = 1) {
    const { project: project , ...auth } = $eafba1a88b5307ad$export$88ed64d9a8c4dc4e();
    try {
        const res = await $868664d0d3c4005e$var$API.get(`/${project}/tickets`, {
            auth: auth,
            params: {
                query: query,
                page: page
            }
        });
        return $eafba1a88b5307ad$export$7b85fd78dd236198(res.data["tickets"]["ticket"]);
    } catch (error) {
        if (error?.response?.status === 404) {
            $eafba1a88b5307ad$export$641374ffb95bc399.info("There is no ticket matching your query.");
            $WOmHB$process.exit(0);
        } else {
            $eafba1a88b5307ad$export$641374ffb95bc399.fail("An error occurred querying your tickets.");
            $WOmHB$process.exit(1);
        }
    }
}
async function $868664d0d3c4005e$export$3d9b22d1b89cce7d(id, payload) {
    const { project: project , ...auth } = $eafba1a88b5307ad$export$88ed64d9a8c4dc4e();
    try {
        await $868664d0d3c4005e$var$API.post(`/${project}/tickets/${id}/notes`, {
            auth: auth,
            data: payload
        });
    } catch (error) {
        console.log(error.message);
        $eafba1a88b5307ad$export$641374ffb95bc399.fail("Could not update the ticket");
        $WOmHB$process.exit(1);
    }
}




const $05c2888c267848c1$var$prompt = ($parcel$interopDefault($WOmHB$inquirer)).prompt;
const $05c2888c267848c1$export$1613a8bb42ebacf3 = {
    LOGIN: async ()=>{
        const auth = await $05c2888c267848c1$var$prompt([
            {
                type: "input",
                name: "username",
                message: "API Username:"
            },
            {
                type: "input",
                name: "password",
                message: "API Key:"
            }, 
        ]);
        const user = await $868664d0d3c4005e$export$85d699ca8330b9a9(auth);
        const projects = $eafba1a88b5307ad$export$7b85fd78dd236198(user.assignments.assignment).map((assignment)=>assignment.name.text
        );
        const { project: project  } = await $05c2888c267848c1$var$prompt([
            {
                type: "list",
                name: "project",
                message: "Select the project you want to work with:",
                choices: projects
            }, 
        ]);
        await $8f83ea1763790a89$export$a1e5c04c89b5bd35(projects);
        $eafba1a88b5307ad$export$35a8f55d0558254c({
            ...auth,
            project: project
        });
        $eafba1a88b5307ad$export$641374ffb95bc399.start("Getting project details...");
        const getProjectDetails = [
            $868664d0d3c4005e$export$2596ab7ef92449e4,
            $868664d0d3c4005e$export$dcc5d2f98fd9404b,
            $868664d0d3c4005e$export$7a0f33e8df10bd94,
            $868664d0d3c4005e$export$489e9c0d7da0a5e2,
            $868664d0d3c4005e$export$925a4945a6cd0f3e
        ].map((fn)=>fn.call(null, {
                ...auth,
                project: project
            })
        );
        await Promise.all(getProjectDetails).then($8f83ea1763790a89$export$929d678737a9c29d);
        const successMessage = $WOmHB$util.format("Connected to %s as %s", ...[
            project,
            auth.username
        ].map((name)=>($parcel$interopDefault($WOmHB$chalk)).blueBright(name)
        ));
        $eafba1a88b5307ad$export$641374ffb95bc399.succeed(`Connected to ${project} as ${successMessage}`);
    },
    CUSTOM_QUERY: async (options)=>{
        if (options.list) {
            const savedQueries = await $8f83ea1763790a89$export$16d4b050c91c6b25();
            if (savedQueries.length) {
                $eafba1a88b5307ad$export$641374ffb95bc399.info("Saved custom queries:");
                console.table(savedQueries.map((query)=>{
                    const { id: id , ...queryDetails } = query;
                    return queryDetails;
                }));
            } else $eafba1a88b5307ad$export$641374ffb95bc399.info("There is no saved queries.");
            return;
        }
        await $05c2888c267848c1$var$prompt([
            {
                type: "input",
                name: "name",
                message: "provide a name for your query: ",
                validate: async function(queryName) {
                    const queryExists = await $8f83ea1763790a89$export$3b875dcb63f77fbe(queryName);
                    if (options.overwrite && queryExists) console.error("query already exist. try -o, --overwrite option if you want to overwrite");
                    return true;
                }
            },
            {
                type: "input",
                name: "query",
                message: "provide a comma-seperated query (i.e assignee:janedoe,sorted:status)"
            }, 
        ]).then($8f83ea1763790a89$export$dc3c8ec2500dd7b7);
    },
    INTERACTIVE_UPDATE: async function() {
        const { users: users , categories: categories , priorities: priorities , types: types , statuses: statuses  } = await $8f83ea1763790a89$export$b2c8652ae76baf();
        const editor = `{
  "assignee": "*",  
  "status":   "*", 
  "type":     "*",
  "priority": "*", 
  "category": "*", 
  "comment":  "*", 
  "subject":  "*" 
}

Note: Do no remove curly braces, change only * marks.

--- Project Details ---

${Object.entries({
            statuses: statuses,
            types: types,
            categories: categories,
            priorities: priorities
        }).map(([header, values])=>$eafba1a88b5307ad$export$2d35fc1c790ede(values.map((value)=>value.name
            ), header)
        ).join("\n")}

${$eafba1a88b5307ad$export$2d35fc1c790ede(users.map((user)=>user.username
        ), "Users")}
`;
        const { payload: payload  } = await $05c2888c267848c1$var$prompt([
            {
                type: "editor",
                name: "payload",
                message: "Fill the fields marked with *",
                default: editor
            }, 
        ]);
        return JSON.parse(payload.slice(0, payload.indexOf("}") + 1));
    }
};




const $b172900270a67470$var$program = new $WOmHB$commander.Command();
$b172900270a67470$var$program.command("in").description("login your codebase account with api credentials").action($05c2888c267848c1$export$1613a8bb42ebacf3.LOGIN).addHelpText("after", ($parcel$interopDefault($WOmHB$chalk)).redBright("You can find your api credentials on codebasehq.com/settings/profile \n"));
$b172900270a67470$var$program.command("out").description("logout your current user").action(()=>{
    const user = undefined;
    if (user) {
        try {
            $WOmHB$fs.unlinkSync(".env");
        } catch (error) {
            $eafba1a88b5307ad$export$641374ffb95bc399.fail("Could not delete env credentials");
        }
        $eafba1a88b5307ad$export$641374ffb95bc399.succeed("Logout successfully.");
    } else $eafba1a88b5307ad$export$641374ffb95bc399.fail("There is no authenticated user to log out.");
});
$b172900270a67470$var$program.parseAsync($WOmHB$process.argv);








const $beabb21baa973552$var$program = new $WOmHB$commander.Command();
const $beabb21baa973552$var$query = $beabb21baa973552$var$program.name("cbase").usage("get [ticket-id] [options]").argument("[id]", "get specific ticket details").option("-a, --assignee <assignee>", "List tickets by assignee", "me").option("-p, --priority <priority>", "List tickets by priority").option("-s, --status <status>", "List tickets by status").option("-t, --type <type>", "List tickets by type").option("-h, --head <number>", "Display top <number> ticket", "10").option("-u, --updates <number>", "Display last <number> ticket updates (works only with given ticket-id)", "3").option("-S, --sort <type>", "Sort ticket by <type>", "priority").addHelpText("after", $a7aecb6c090f1d5b$export$91a19ee5dcaaf6ed.get).action(async (ticketId, { updates: updates , head: head , ...queries })=>{
    const finalQuery = ticketId ? `id:${ticketId}` : $eafba1a88b5307ad$export$7128756d03dbde02(queries);
    const tickets = await $868664d0d3c4005e$export$91f71c9bcfb4cf89(finalQuery);
    $eafba1a88b5307ad$export$23324e4f3fd0169c(tickets);
    if (ticketId) $eafba1a88b5307ad$export$70db5978a071ae83(ticketId, Number(updates));
});
$beabb21baa973552$var$query.command("add").description("add custom query").option("-o, --overwrite", "overwrite query if it exists").option("-l, --list", "list added queries").action($05c2888c267848c1$export$1613a8bb42ebacf3.CUSTOM_QUERY);
$beabb21baa973552$var$program.parse($WOmHB$process.argv);








const $1b0dcec8e8447657$var$program = new $WOmHB$commander.Command();
$1b0dcec8e8447657$var$program.usage("cbase set <ticket-id> [options]").argument("<id>", "ticket id").description("Update tickets on your terminal").option("-a, --assignee <assignee>", "Update assignee").option("-c, --category <category>", "Update category").option("-C, --comment <comment>", "Add ticket comment").option("-p, --priority <priority>", "Update priority").option("-s, --status <status>", "Update status").option("-S, --subject <subject>", "Update ticket header").option("-t, --type <type>", "Update ticket type").option("-T, --tag <tag>", "Add ticket tag").option("-P, --private-update", "Make updates private").option("-i, --interactive", "Update ticket interactively in a more concise way").action(async (id, { notes: notes , interactive: interactive , ...options })=>{
    const updatedFields = interactive ? await $05c2888c267848c1$export$1613a8bb42ebacf3.INTERACTIVE_UPDATE() : options;
    const payload = await $eafba1a88b5307ad$export$bbd6435d6176fff9(updatedFields);
    $eafba1a88b5307ad$export$641374ffb95bc399.start("Updating ticket...");
    await $868664d0d3c4005e$export$3d9b22d1b89cce7d(id, payload);
    $eafba1a88b5307ad$export$641374ffb95bc399.succeed("Ticket updated.");
}).addHelpText("after", $a7aecb6c090f1d5b$export$91a19ee5dcaaf6ed.set);
$1b0dcec8e8447657$var$program.parseAsync($WOmHB$process.argv);



var $49200a88616f5c5f$var$__dirname = "Documents/personal-work/cbase/src";
const $49200a88616f5c5f$export$ee72801824c03e63 = new $WOmHB$commander.Command();
const $49200a88616f5c5f$var$paths = {
    log: ($parcel$interopDefault($WOmHB$path)).join($49200a88616f5c5f$var$__dirname, "commands", "log.js"),
    get: ($parcel$interopDefault($WOmHB$path)).join($49200a88616f5c5f$var$__dirname, "commands", "get.js"),
    set: ($parcel$interopDefault($WOmHB$path)).join($49200a88616f5c5f$var$__dirname, "commands", "set.js")
};
$49200a88616f5c5f$export$ee72801824c03e63.name("cbase").addHelpText("beforeAll", ($parcel$interopDefault($WOmHB$chalk)).bold.whiteBright("Bring codebase into your terminal")).version((/*@__PURE__*/$parcel$interopDefault($7ef301c08eaf134d$exports)).version, "-v, --version", "display the current version").command("log", "log-in/out to codebase with your credentials", {
    executableFile: $49200a88616f5c5f$var$paths.log
}).command("get", "get your ticket details", {
    executableFile: $49200a88616f5c5f$var$paths.get
}).alias("g").command("set", "set your ticket details", {
    executableFile: $49200a88616f5c5f$var$paths.set
}).alias("s");
$49200a88616f5c5f$export$ee72801824c03e63.parse($WOmHB$process.argv);


//# sourceMappingURL=index.js.map

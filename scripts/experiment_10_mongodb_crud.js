/**
 * ============================================================================
 * SOFTWARE ENGINEERING / DBMS LAB - EXPERIMENT 10
 * Topic: MongoDB CRUD Operations using MongoDB Shell (mongosh)
 * Students: Tanay Dekate (N022), Jivitesh Dutt (N026), Gatha Jain (N038)
 * SVKM's NMIMS MPSTME - Campus Lost & Found Management System
 * ============================================================================
 * 
 * Instructions:
 * 1. If MongoDB is installed locally:
 *    Run with mongosh: mongosh < scripts/experiment_10_mongodb_crud.js
 * 
 * 2. If running standalone in Node.js (reproducible demonstration):
 *    Run: node scripts/experiment_10_mongodb_crud.js
 * ============================================================================
 */

// Detect runtime environment: mongosh shell or Node.js runner
const isMongosh = typeof db !== 'undefined';

if (!isMongosh) {
    console.log("========================================================================");
    console.log("   CAMPUS LOST & FOUND MANAGEMENT SYSTEM - MONGODB CRUD DEMONSTRATION   ");
    console.log("   NMIMS MPSTME - Software Engineering Lab Experiment 10                ");
    console.log("========================================================================");
    console.log("[Info] Executing reproducible MongoDB CRUD demonstration script in Node.js.\n");
    runNodeDemonstration();
} else {
    runMongoShellScript();
}

function runMongoShellScript() {
    // 1. Select database
    // use campus_lost_and_found_db;

    print("\n--- 1. SHOW DATABASES & SWITCH ---");
    db = db.getSiblingDB("campus_lost_and_found_db");
    print("Switched to db: " + db.getName());

    // Clean up collection for reproducible runs
    db.found_items.drop();
    db.ownership_claims.drop();

    // 2. Create Collections explicitly
    print("\n--- 2. CREATE COLLECTIONS ---");
    db.createCollection("found_items");
    db.createCollection("ownership_claims");
    printjson(db.getCollectionNames());

    // 3. INSERT ONE (insertOne)
    print("\n--- 3. INSERT ONE DOCUMENT (insertOne) ---");
    const insertOneResult = db.found_items.insertOne({
        itemTitle: "Apple MacBook Air M2 Space Grey",
        category: "Electronics",
        brand: "Apple",
        color: "Space Grey",
        foundLocation: "Library 2nd Floor Reading Room Desk 14",
        foundDate: new Date("2026-10-20T14:30:00Z"),
        custodyLocation: "Security Control Room Safe Cabinet A-3",
        status: "in_custody",
        isValuable: true,
        secretIdentifyingDetails: "Custom stickers: GitHub Octocat & Docker whale",
        reportedBy: {
            name: "Sunil Patil",
            role: "Library Assistant",
            staffId: "EMP-LIB-884"
        },
        tags: ["laptop", "apple", "macbook", "space-grey"]
    });
    printjson(insertOneResult);

    // 4. INSERT MANY (insertMany)
    print("\n--- 4. INSERT MULTIPLE DOCUMENTS (insertMany) ---");
    const insertManyResult = db.found_items.insertMany([
        {
            itemTitle: "Casio FX-991CW ClassWiz Scientific Calculator",
            category: "Stationery / Academics",
            brand: "Casio",
            color: "Black",
            foundLocation: "Room 402, 4th Floor Engineering Wing",
            foundDate: new Date("2026-10-21T09:15:00Z"),
            custodyLocation: "Lost & Found Locker Box 12",
            status: "in_custody",
            isValuable: false,
            tags: ["calculator", "casio", "exam"]
        },
        {
            itemTitle: "Stainless Steel Insulated Water Bottle (Milton 1000ml)",
            category: "Personal Belongings",
            brand: "Milton",
            color: "Metallic Blue",
            foundLocation: "MPSTME Ground Floor Canteen Table 8",
            foundDate: new Date("2026-10-22T13:00:00Z"),
            custodyLocation: "Lost & Found Rack 2",
            status: "in_custody",
            isValuable: false,
            tags: ["bottle", "canteen", "blue"]
        },
        {
            itemTitle: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
            category: "Electronics",
            brand: "Sony",
            color: "Silver",
            foundLocation: "Computer Lab 612",
            foundDate: new Date("2026-10-23T16:45:00Z"),
            custodyLocation: "Security Safe Cabinet B-1",
            status: "in_custody",
            isValuable: true,
            secretIdentifyingDetails: "Initials 'TD' scratched softly under left earcup",
            tags: ["audio", "sony", "headphones", "bluetooth"]
        },
        {
            itemTitle: "NMIMS Student Identity Card - Tanay Dekate (N022)",
            category: "Identity & Cards",
            brand: "NMIMS",
            color: "White/Blue",
            foundLocation: "Sports Complex Badminton Court",
            foundDate: new Date("2026-10-24T18:10:00Z"),
            custodyLocation: "Main Reception Desk File Tray",
            status: "ready_for_handover",
            isValuable: true,
            tags: ["idcard", "student", "nmims"]
        }
    ]);
    printjson(insertManyResult);

    // 5. FIND (find with query and projection)
    print("\n--- 5. FIND DOCUMENTS (find with filters) ---");
    print(">> Query: Electronics category with isValuable = true");
    const foundElectronics = db.found_items.find(
        { category: "Electronics", isValuable: true },
        { itemTitle: 1, brand: 1, custodyLocation: 1, status: 1 }
    ).toArray();
    printjson(foundElectronics);

    // 6. UPDATE ONE (updateOne)
    print("\n--- 6. UPDATE ONE DOCUMENT (updateOne) ---");
    print(">> Moving MacBook custody to High Security Vault Locker 01");
    const updateOneResult = db.found_items.updateOne(
        { itemTitle: { $regex: /MacBook/i } },
        { 
            $set: { 
                custodyLocation: "High Security Vault Locker 01", 
                updatedAt: new Date() 
            },
            $push: { tags: "vault-secured" }
        }
    );
    printjson(updateOneResult);

    // 7. UPDATE MANY (updateMany)
    print("\n--- 7. UPDATE MULTIPLE DOCUMENTS (updateMany) ---");
    print(">> Flagging all items found before Oct 22 as eligible for batch reminder");
    const updateManyResult = db.found_items.updateMany(
        { foundDate: { $lt: new Date("2026-10-22T00:00:00Z") } },
        { $set: { reminderSent: true, retentionNoticePeriodDays: 30 } }
    );
    printjson(updateManyResult);

    // 8. DELETE ONE (deleteOne)
    print("\n--- 8. DELETE ONE DOCUMENT (deleteOne) ---");
    print(">> Removing duplicate test entry for Water Bottle");
    const deleteOneResult = db.found_items.deleteOne({
        itemTitle: { $regex: /Water Bottle/i }
    });
    printjson(deleteOneResult);

    // 9. DELETE MANY (deleteMany)
    print("\n--- 9. DELETE MULTIPLE DOCUMENTS (deleteMany) ---");
    print(">> Cleaning up any temporary test items");
    const deleteManyResult = db.found_items.deleteMany({
        status: "draft_test"
    });
    printjson(deleteManyResult);

    // 10. FINAL COLLECTION COUNT AND SUMMARY
    print("\n--- 10. COLLECTION SUMMARY ---");
    print("Remaining items count: " + db.found_items.countDocuments());
    print("Experiment 10 MongoDB CRUD operations completed successfully!");
}

function runNodeDemonstration() {
    // Pure JavaScript in-memory MongoDB CRUD execution engine mimicking mongosh API
    class InMemoryMongoCollection {
        constructor(name) {
            this.name = name;
            this.docs = [];
            this.idCounter = 1;
        }

        insertOne(doc) {
            const inserted = { _id: "671ba" + String(this.idCounter++).padStart(19, '0'), ...doc };
            this.docs.push(inserted);
            return { acknowledged: true, insertedId: inserted._id };
        }

        insertMany(docs) {
            const insertedIds = {};
            docs.forEach((doc, idx) => {
                const inserted = { _id: "671ba" + String(this.idCounter++).padStart(19, '0'), ...doc };
                this.docs.push(inserted);
                insertedIds[idx] = inserted._id;
            });
            return { acknowledged: true, insertedCount: docs.length, insertedIds };
        }

        find(filter = {}, projection = {}) {
            let res = this.docs.filter(doc => {
                for (let k in filter) {
                    if (filter[k] && typeof filter[k] === 'object' && filter[k].$regex) {
                        if (!filter[k].$regex.test(doc[k])) return false;
                    } else if (filter[k] && typeof filter[k] === 'object' && filter[k].$lt) {
                        if (!(new Date(doc[k]) < new Date(filter[k].$lt))) return false;
                    } else if (doc[k] !== filter[k]) {
                        return false;
                    }
                }
                return true;
            });

            if (Object.keys(projection).length > 0) {
                res = res.map(doc => {
                    const projected = {};
                    for (let p in projection) {
                        if (projection[p]) projected[p] = doc[p];
                    }
                    if (projection._id !== 0) projected._id = doc._id;
                    return projected;
                });
            }
            return {
                toArray: () => res
            };
        }

        updateOne(filter, update) {
            const target = this.find(filter).toArray()[0];
            if (!target) return { matchedCount: 0, modifiedCount: 0 };
            const doc = this.docs.find(d => d._id === target._id);
            if (update.$set) Object.assign(doc, update.$set);
            if (update.$push) {
                for (let k in update.$push) {
                    if (Array.isArray(doc[k])) doc[k].push(update.$push[k]);
                }
            }
            return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
        }

        updateMany(filter, update) {
            const targets = this.find(filter).toArray();
            let count = 0;
            targets.forEach(t => {
                const doc = this.docs.find(d => d._id === t._id);
                if (update.$set) Object.assign(doc, update.$set);
                count++;
            });
            return { acknowledged: true, matchedCount: targets.length, modifiedCount: count };
        }

        deleteOne(filter) {
            const target = this.find(filter).toArray()[0];
            if (!target) return { acknowledged: true, deletedCount: 0 };
            this.docs = this.docs.filter(d => d._id !== target._id);
            return { acknowledged: true, deletedCount: 1 };
        }

        deleteMany(filter) {
            const targets = this.find(filter).toArray();
            const targetIds = new Set(targets.map(t => t._id));
            this.docs = this.docs.filter(d => !targetIds.has(d._id));
            return { acknowledged: true, deletedCount: targets.length };
        }

        countDocuments() {
            return this.docs.length;
        }
    }

    const found_items = new InMemoryMongoCollection("found_items");

    console.log(">> Command 1: db.createCollection('found_items')");
    console.log("Collection 'found_items' initialized.");

    console.log("\n>> Command 2: db.found_items.insertOne(...)");
    const r1 = found_items.insertOne({
        itemTitle: "Apple MacBook Air M2 Space Grey",
        category: "Electronics",
        brand: "Apple",
        color: "Space Grey",
        foundLocation: "Library 2nd Floor Reading Room Desk 14",
        foundDate: "2026-10-20T14:30:00Z",
        custodyLocation: "Security Control Room Safe Cabinet A-3",
        status: "in_custody",
        isValuable: true,
        tags: ["laptop", "apple", "macbook", "space-grey"]
    });
    console.log("Result:", JSON.stringify(r1, null, 2));

    console.log("\n>> Command 3: db.found_items.insertMany(...)");
    const r2 = found_items.insertMany([
        {
            itemTitle: "Casio FX-991CW ClassWiz Scientific Calculator",
            category: "Stationery / Academics",
            brand: "Casio",
            color: "Black",
            foundLocation: "Room 402, 4th Floor Engineering Wing",
            foundDate: "2026-10-21T09:15:00Z",
            custodyLocation: "Lost & Found Locker Box 12",
            status: "in_custody",
            isValuable: false,
            tags: ["calculator", "casio", "exam"]
        },
        {
            itemTitle: "Stainless Steel Insulated Water Bottle (Milton 1000ml)",
            category: "Personal Belongings",
            brand: "Milton",
            color: "Metallic Blue",
            foundLocation: "MPSTME Ground Floor Canteen Table 8",
            foundDate: "2026-10-22T13:00:00Z",
            custodyLocation: "Lost & Found Rack 2",
            status: "in_custody",
            isValuable: false,
            tags: ["bottle", "canteen", "blue"]
        },
        {
            itemTitle: "Sony WH-1000XM5 Wireless Headphones",
            category: "Electronics",
            brand: "Sony",
            color: "Silver",
            foundLocation: "Computer Lab 612",
            foundDate: "2026-10-23T16:45:00Z",
            custodyLocation: "Security Safe Cabinet B-1",
            status: "in_custody",
            isValuable: true,
            tags: ["audio", "sony", "headphones", "bluetooth"]
        },
        {
            itemTitle: "NMIMS Student Identity Card - Tanay Dekate (N022)",
            category: "Identity & Cards",
            brand: "NMIMS",
            color: "White/Blue",
            foundLocation: "Sports Complex Badminton Court",
            foundDate: "2026-10-24T18:10:00Z",
            custodyLocation: "Main Reception Desk File Tray",
            status: "ready_for_handover",
            isValuable: true,
            tags: ["idcard", "student", "nmims"]
        }
    ]);
    console.log("Result:", JSON.stringify(r2, null, 2));

    console.log("\n>> Command 4: db.found_items.find({ category: 'Electronics', isValuable: true })");
    const r3 = found_items.find(
        { category: "Electronics", isValuable: true },
        { itemTitle: 1, brand: 1, custodyLocation: 1, status: 1 }
    ).toArray();
    console.log("Found Documents:", JSON.stringify(r3, null, 2));

    console.log("\n>> Command 5: db.found_items.updateOne({ itemTitle: /MacBook/i }, { $set: { custodyLocation: 'High Security Vault Locker 01' } })");
    const r4 = found_items.updateOne(
        { itemTitle: { $regex: /MacBook/i } },
        { $set: { custodyLocation: "High Security Vault Locker 01" } }
    );
    console.log("Result:", JSON.stringify(r4, null, 2));

    console.log("\n>> Command 6: db.found_items.updateMany({ foundDate: { $lt: '2026-10-22' } }, { $set: { reminderSent: true } })");
    const r5 = found_items.updateMany(
        { foundDate: { $lt: "2026-10-22" } },
        { $set: { reminderSent: true } }
    );
    console.log("Result:", JSON.stringify(r5, null, 2));

    console.log("\n>> Command 7: db.found_items.deleteOne({ itemTitle: /Water Bottle/i })");
    const r6 = found_items.deleteOne({ itemTitle: { $regex: /Water Bottle/i } });
    console.log("Result:", JSON.stringify(r6, null, 2));

    console.log("\n>> Command 8: db.found_items.deleteMany({ status: 'draft_test' })");
    const r7 = found_items.deleteMany({ status: "draft_test" });
    console.log("Result:", JSON.stringify(r7, null, 2));

    console.log("\n>> Final Count of Documents:");
    console.log("Remaining Documents in found_items collection:", found_items.countDocuments());
    console.log("\n[SUCCESS] Experiment 10 MongoDB CRUD operations executed completely.");
}

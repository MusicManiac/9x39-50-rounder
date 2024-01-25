import { DependencyContainer } from "tsyringe";
import { Ilogger } from "@spt-aki/models/spt/utils/Ilogger";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

//item creation
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";


class MusicManiac_9x39_50_rounder implements IPostDBLoadMod
{
	private logger: Ilogger;

	public postDBLoad ( container: DependencyContainer ): void 
	{
		// Get the logger from the server container.
		this.logger = container.resolve<Ilogger>("WinstonLogger");
		this.logger.info( "[MusicManiac 9x39 50-rounder] MusicManiac 9x39 50-rounder started loading");
		// Get database from server.
		const db = container.resolve<DatabaseServer>( "DatabaseServer" );

		//Custom item server to create new items.
		const customItem = container.resolve<CustomItemService>( "CustomItemService" );


		// Get tables from database
		let tables = db.getTables();
		// Get item database from tables
		const itemDB = tables.templates.items;
		const handbook = tables.templates.handbook;

		let originMag = "55d481904bdc2d8c2f8b456a"

		let newName = "9x39mm 6L35 50-round magazine";
		const handbookEntry = handbook.Items.find(item => item.Id === originMag);
		const handbookParentId = handbookEntry ? handbookEntry.ParentId : undefined;
		let newID = "9x39mm 6L35 50-round magazine";

		const magUp: NewItemFromCloneDetails = {
			itemTplToClone: originMag,
			overrideProperties: {
				BackgroundColor : "green",
				Cartridges: [
					{
						_id: "9x39mm_6L35_cartrige_id",
						_max_count: 50,
						_name: "cartridges",
						_parent: newName,
						_props: {
							filters: [
								{
									Filter: [
										"5c0d688c86f77413ae3407b2",
										"61962d879bb3d20b0946d385",
										"57a0dfb82459774d3078b56c",
										"57a0e5022459774d1673f889",
										"5c0d668f86f7747ccb7f13b2"
									]
								}
							]
						}
					}
				] 
			},
			newId: newID,
			parentId: itemDB[ originMag ]._parent,
			handbookParentId: handbookParentId,
			fleaPriceRoubles: 60000,
			handbookPriceRoubles: 60000,
			locales: {
				"en": {
					name: newName,
					shortName: "6L35",
					description: "50-rounder for 9x39 weapons"
				}
			}
		}
		customItem.createItemFromClone(magUp);
		
		itemDB["57c44b372459772d2b39b8ce"]._props.Slots[2]._props.filters[0].Filter.push(newID);
		itemDB["57838ad32459774a17445cd2"]._props.Slots[1]._props.filters[0].Filter.push(newID);

		tables.traders["5a7c2eca46aef81a7ca2145d"].assort.items.push(
			{
				"_id": "9x39mm 6L35 50-round magazine",
				"_tpl": "9x39mm 6L35 50-round magazine",
				"parentId": "hideout",
				"slotId": "hideout",
				"upd": {
					"UnlimitedCount": true,
					"StackObjectsCount": 999999
				}
			}
		);

		tables.traders["5a7c2eca46aef81a7ca2145d"].assort.barter_scheme["9x39mm 6L35 50-round magazine"] = [
			[
				{
					"count": 62000,
					"_tpl": "5449016a4bdc2d6f028b456f"
				}
			]
		];

		tables.traders["5a7c2eca46aef81a7ca2145d"].assort.loyal_level_items["9x39mm 6L35 50-round magazine"] = 2;
		this.logger.info( "[MusicManiac 9x39 50-rounder] MusicManiac 9x39 50-rounder finished loading");
	}
}

module.exports = { mod: new MusicManiac_9x39_50_rounder() }
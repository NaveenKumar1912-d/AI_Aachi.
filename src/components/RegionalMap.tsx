import mapImage from "@/assets/tamil-nadu-map.jpg";

const RegionalMap = () => {
  const regionalSpecialties = [
    {
      region: "Chettinad",
      dishes: "Chettinad Chicken, Kola Urundai, Pepper Chicken",
      description: "Known for fiery spices and aromatic flavors"
    },
    {
      region: "Madurai",
      dishes: "Jigarthanda, Kari Dosa, Paruthi Paal",
      description: "Temple city with unique street food culture"
    },
    {
      region: "Kongu Nadu",
      dishes: "Arisi Paruppu Sadam, Kola Kuzhambu",
      description: "Western Tamil Nadu's rustic farm flavors"
    },
    {
      region: "Tanjore",
      dishes: "Puliyodharai, Vadagam, Thayir Sadam",
      description: "Royal cuisine with refined techniques"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Taste Tamil Nadu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enga naatula enna samayal famous? Therinjukonga! 
            <br />
            <span className="text-sm">(Discover what each region is famous for!)</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl animate-scale-in">
            <img 
              src={mapImage} 
              alt="Tamil Nadu Food Map" 
              className="w-full h-auto"
            />
          </div>

          {/* Regional Specialties */}
          <div className="space-y-4 animate-fade-in">
            {regionalSpecialties.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-lg border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {item.region}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.dishes.split(", ").map((dish, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground italic">
            "Oru oor samayal, oru vitham suvaiyum flavor!" 
            <br />
            <span className="text-sm">(Every region has its own unique taste and flavor!)</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegionalMap;

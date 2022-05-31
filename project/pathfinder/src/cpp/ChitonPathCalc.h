#include <vector>
#include <set>
#include <climits>
#include <string>

#include <queue>

struct Coordinates
{
    int x;
    int y;
    // Coordinates(/* args */);
    // ~ChitonPathCalc();
    // Coordinates()
    // {
    //     this->x = 0;
    //     this->y = 0;
    // };
    // Coordinates(int x, int y)
    // {
    //     this->x = x;
    //     this->y = y;
    // };
};
struct GraphElm
{
    /* data */
    int estDistance;
    int cost;
    bool visted;
    struct GraphElm *prv;
    std::vector<Coordinates> connectedElm;
    Coordinates crd;
    bool operator<(const GraphElm &ge) const { return estDistance < ge.estDistance; }
    bool operator==(const GraphElm &ge) const { return (crd.x == ge.crd.x) && (crd.y == ge.crd.y); }
    GraphElm()
    {
        estDistance = INT_MAX;
        visted = false;
        prv = nullptr;
    }
};
class ChitonPathCalc
{
private:
    /* data */
    std::vector<std::vector<int>> board;
    std::vector<int> pickedValues();
    std::vector<Coordinates> dijkstraAlgorithm(std::vector<std::vector<GraphElm>> &boardElements);
    GraphElm *findLowestUnvistedButSeen(std::vector<GraphElm *> &seenButNotInvisted);
    void addItemToUnvistedList(std::vector<GraphElm *> &seenButNotInvisted, GraphElm &elm);
    std::vector<Coordinates> findShortestPath(std::vector<std::vector<GraphElm>> &boardElements);

    std::queue<std::string> msgQueue;

public:
    ChitonPathCalc(/* args */);
    ~ChitonPathCalc();
    void addRowToMap(const std::vector<int> row);

    std::vector<Coordinates> calcPath();
    std::string printSomething();
    int sumArray();

    std::string getMessage();
    void addMessage(std::string message);
};